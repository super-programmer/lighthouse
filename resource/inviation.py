import requests
import time
import random
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime, date
import os
import re

# 确保结果目录存在
if not os.path.exists('zj_ggzy_tenders'):
    os.makedirs('zj_ggzy_tenders')

class ZhejiangGGZYSpiders:
    def __init__(self):
        self.base_url = "https://ggzy.zj.gov.cn/jyxxgk/list.html"
        self.keywords = ["边坡治理", "边坡防护", "滑坡治理", "山体边坡", "边坡工程"]
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Referer": "https://ggzy.zj.gov.cn/",
            "Connection": "keep-alive"
        }
        self.results = []
        self.today = date.today()  # 筛选今日及之后的信息

    def random_sleep(self):
        """随机休眠，避免反爬"""
        time.sleep(random.uniform(2, 4))

    def parse_date(self, date_str):
        """解析发布时间为日期对象"""
        if not date_str:
            return None
        
        # 提取字符串中的日期（如“2025-10-27”）
        date_match = re.search(r'\b\d{4}-\d{2}-\d{2}\b', date_str)
        if not date_match:
            return None
        
        try:
            return datetime.strptime(date_match.group(), '%Y-%m-%d').date()
        except ValueError:
            return None

    def is_valid_date(self, publish_date):
        """检查是否为今日及之后的信息"""
        parsed_date = self.parse_date(publish_date)
        return parsed_date is not None and parsed_date >= self.today

    def fetch_list_page(self, page=1):
        """解析列表页HTML，提取招标信息链接"""
        try:
            # 构造分页URL（该网站分页参数为“pageNum”）
            page_url = f"{self.base_url}?pageNum={page}&pageSize=15"
            response = requests.get(
                page_url,
                headers=self.headers,
                timeout=15,
                verify=False  # 避免SSL证书验证问题（部分环境可能触发）
            )
            response.encoding = "utf-8"

            if response.status_code != 200:
                print(f"列表页请求失败，URL: {page_url}，状态码: {response.status_code}")
                return []

            soup = BeautifulSoup(response.text, 'html.parser')
            # 定位招标信息列表（根据网站实际HTML结构调整）
            tender_items = soup.select("div.news-list > ul > li")
            if not tender_items:
                print(f"第 {page} 页未找到招标信息列表")
                return []

            valid_links = []
            for item in tender_items:
                # 提取标题和链接
                title_elem = item.select_one("a")
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                href = title_elem.get("href")
                if not href or not title:
                    continue

                # 筛选包含关键词的信息
                if any(keyword in title for keyword in self.keywords):
                    # 处理相对链接，转为绝对链接
                    if href.startswith('http'):
                        full_url = href
                    else:
                        full_url = f"https://ggzy.zj.gov.cn{href}" if href.startswith('/') else f"{self.base_url.rsplit('/', 1)[0]}/{href}"
                    
                    # 提取发布时间（列表页已显示，提前筛选避免无效详情页请求）
                    time_elem = item.select_one("span.time")
                    publish_time = time_elem.get_text(strip=True) if time_elem else ""
                    
                    valid_links.append({
                        "title": title,
                        "url": full_url,
                        "publish_time": publish_time
                    })

            return valid_links

        except Exception as e:
            print(f"解析列表页失败（第 {page} 页）: {str(e)}")
            return []

    def parse_detail_page(self, item):
        """解析详情页，提取完整信息"""
        try:
            self.random_sleep()
            response = requests.get(
                item["url"],
                headers=self.headers,
                timeout=15,
                verify=False
            )
            response.encoding = "utf-8"

            if response.status_code != 200:
                print(f"详情页请求失败，URL: {item['url']}")
                return None

            soup = BeautifulSoup(response.text, 'html.parser')
            # 提取招标人信息
            tenderer = ""
            content_elems = soup.select("div.article-content p, div.article-content div")
            for elem in content_elems:
                text = elem.get_text(strip=True)
                if "招标人：" in text or "招标人:" in text:
                    tenderer = text.replace("招标人：", "").replace("招标人:", "").strip()
                    break

            # 提取内容摘要（前500字符）
            content = ""
            content_div = soup.select_one("div.article-content")
            if content_div:
                content = content_div.get_text(strip=True)[:500]

            return {
                "标题": item["title"],
                "发布时间": item["publish_time"],
                "招标人": tenderer,
                "详情链接": item["url"],
                "内容摘要": content,
                "爬取时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

        except Exception as e:
            print(f"解析详情页失败（{item['title']}）: {str(e)}")
            return None

    def run(self, max_pages=5):
        """主运行逻辑"""
        print(f"开始爬取浙江省公共资源交易平台招标信息（筛选{self.today}及之后）...")
        
        for page in range(1, max_pages + 1):
            print(f"\n正在爬取第 {page} 页...")
            # 获取列表页有效信息
            list_items = self.fetch_list_page(page)
            if not list_items:
                print("当前页无符合条件的信息，继续下一页")
                self.random_sleep()
                continue

            # 筛选日期有效且解析详情页
            for item in list_items:
                if self.is_valid_date(item["publish_time"]):
                    print(f"匹配有效信息: {item['title']}（{item['publish_time']}）")
                    detail = self.parse_detail_page(item)
                    if detail:
                        self.results.append(detail)

        # 保存结果
        self.save_results()
        print(f"\n爬取完成！共获取 {len(self.results)} 条符合条件的招标信息")

    def save_results(self):
        """保存结果到Excel和CSV"""
        if not self.results:
            print("无符合条件的结果可保存")
            return
        
        df = pd.DataFrame(self.results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        excel_path = f"zj_ggzy_tenders/浙江边坡治理招标_{timestamp}.xlsx"
        csv_path = f"zj_ggzy_tenders/浙江边坡治理招标_{timestamp}.csv"
        
        df.to_excel(excel_path, index=False)
        df.to_csv(csv_path, index=False, encoding="utf-8-sig")
        
        print(f"结果已保存至:\n- Excel: {excel_path}\n- CSV: {csv_path}")

if __name__ == "__main__":
    # 解决requests的SSL验证警告（可选，不影响功能）
    import warnings
    warnings.filterwarnings("ignore", category=requests.packages.urllib3.exceptions.InsecureRequestWarning)
    
    spider = ZhejiangGGZYSpiders()
    spider.run(max_pages=5)  # 可调整爬取页数