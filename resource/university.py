import time
import os
import sys
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    WebDriverException,
    TimeoutException,
    NoSuchElementException
)

# 屏蔽浏览器底层错误日志（仅保留脚本输出）
class NullDevice:
    def write(self, s):
        pass
    def flush(self):
        pass
sys.stderr = NullDevice()

def create_edge_driver(driver_path):
    edge_options = Options()
    # 1. 移除冲突的SSL协议配置（核心修复！）
    # 原代码中--tls-version-min=1.0与--ssl-version-min=tls1.2冲突，导致协议协商失败
    # edge_options.add_argument('--tls-version-min=1.0')  # 移除这行！！！
    
    # 2. 清理加密套件黑名单（关键修复！）
    # 原黑名单禁用了大量套件，可能导致服务器无可用套件进行握手
    # edge_options.add_argument('--cipher-suite-blacklist=0x0088,...')  # 移除这行！！！

    # 3. 正确的TLS版本配置（仅保留高版本）
    edge_options.add_argument('--ssl-version-min=tls1.2')  # 最低TLS 1.2
    edge_options.add_argument('--tls-version-max=tls1.3')  # 最高TLS 1.3
    edge_options.add_argument('--ssl-protocol=TLSv1.2')    # 优先使用TLS 1.2

    # 4. 保留其他有效配置（无头模式、性能优化等）
    edge_options.add_argument('--headless=new')
    edge_options.add_argument('--disable-gpu')
    edge_options.add_argument('--disable-webgl')
    edge_options.add_argument('--disable-webrtc')
    edge_options.add_argument('--disable-p2p')
    edge_options.add_argument('--no-sandbox')
    edge_options.add_argument('--disable-dev-shm-usage')
    edge_options.add_argument('--ignore-certificate-errors')
    edge_options.add_argument('--allow-insecure-localhost')
    edge_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0')
    
    # 5. 补充SSL兼容性参数
    edge_options.add_argument('--allow-running-insecure-content')
    edge_options.add_argument('--disable-certificate-transparency')
    edge_options.add_argument('--dns-prefetch-disable')

    # 6. 日志与特征屏蔽（不变）
    edge_options.add_argument('--log-level=3')
    edge_options.add_argument('--disable-logging')
    edge_options.add_argument('--disable-blink-features=AutomationControlled')
    edge_options.add_argument('--disable-component-update')
    edge_options.add_argument('--disable-network-errors')
    
    # 7. 实验性选项（不变）
    edge_options.add_experimental_option(
        "excludeSwitches", ["ignore-certificate-errors"]
    )
    edge_options.add_experimental_option('prefs', {
        'webrtc.ip_handling_policy': 'disable_non_proxied_udp',
        'webrtc.multiple_routes_enabled': False,
        'webrtc.nonproxied_udp_enabled': False
    })

    # 驱动服务配置（不变）
    service = Service(
        executable_path=driver_path,
        service_args=['--log-path=NUL', '--disable-logging']
    )
    
    return webdriver.Edge(service=service, options=edge_options)

def main():
    try:
        # 1. 路径初始化与检查
        current_dir = os.path.dirname(os.path.abspath(__file__))
        print(f"===== 程序启动，工作目录：{current_dir} =====")

        # 驱动路径检查
        driver_path = os.path.join(current_dir, 'msedgedriver', 'msedgedriver.exe')
        print(f"Edge驱动路径：{driver_path}")
        if not os.path.exists(driver_path):
            raise FileNotFoundError(f"驱动文件不存在！路径：{driver_path}")

        # Excel文件路径
        input_excel_path = os.path.join(current_dir, 'universityList.xls')
        output_excel_path = os.path.join(current_dir, '高校校徽链接.xlsx')
        print(f"输入Excel路径：{input_excel_path}")
        if not os.path.exists(input_excel_path):
            raise FileNotFoundError(f"Excel文件不存在！路径：{input_excel_path}")

        # 2. 读取Excel数据
        print("\n===== 读取Excel数据 =====")
        excel_file = pd.ExcelFile(input_excel_path)
        df = excel_file.parse('全国普通高等学校名单')
        new_header = df.iloc[1]  # 使用第2行作为表头
        df = df[3:].reset_index(drop=True)  # 从第4行开始读取数据
        df.columns = new_header
        # 过滤空值学校名称
        df = df[df['学校名称'].notna() & (df['学校名称'] != '')].reset_index(drop=True)
        total_schools = len(df['学校名称'])
        if total_schools == 0:
            raise ValueError("未找到有效高校名称数据！")
        print(f"有效高校总数：{total_schools}")
        emblem_links = []  # 存储校徽链接

        # 3. 初始化浏览器
        print("\n===== 启动Edge浏览器 =====")
        driver = create_edge_driver(driver_path)
        print("浏览器启动成功（无头模式）")

        # 4. 遍历高校获取校徽链接
        print(f"\n===== 开始处理（共{total_schools}所） =====")
        for idx, school_name in enumerate(df['学校名称'], 1):
            # 每50所重启浏览器，防止会话失效
            if idx % 500 == 0 and idx != 0:
                print(f"\n------ 已处理{idx}所，重启浏览器 ------")
                driver.quit()
                driver = create_edge_driver(driver_path)
                print("浏览器重启完成\n")

            success = False
            # 最多重试3次
            for attempt in range(3):
                try:
                    # # 搜索关键词与URL（百度图片搜索）
                    # search_keyword = f"{school_name} 校徽"
                    # search_url = f"http://image.baidu.com/search/index?tn=baiduimage&word={search_keyword}"
                    # 更换搜索关键词
                    search_keyword = f"{school_name} 校徽"  # 增加"官网"关键词提高准确性
                    # 或更换为必应图片搜索
                    search_url = f"https://cn.bing.com/images/search?q={search_keyword}"
                    # 设置页面加载超时
                    driver.set_page_load_timeout(5)
                    driver.get(search_url)
                    time.sleep(0.5)  # 等待页面渲染
                    print(f"[{idx}/{total_schools}] 访问搜索页面地址：{search_url}")
                    # 等待图片容器和图片元素加载
                    wait = WebDriverWait(driver, 5)
                    # print(f"[{wait}] 等待图片容器和图片元素加载...")
                    # img_element = wait.until(
                    #     EC.presence_of_element_located((
                    #         By.CSS_SELECTOR, 
                    #         '.slist .imgbox .imgitem img, .main_img, .img-hover'
                    #     ))
                    # )
                    img_element = wait.until(
                        EC.presence_of_element_located((
                            By.CSS_SELECTOR, 
                            '.iusc img, .mimg img'  # 必应图片的主要图片元素选择器
                        ))
                    )
                    # print(f"[{img_element}] 链接...")
                    # 多渠道获取图片链接（优先data-imgurl，其次src和data-original）
                    link = (
                        img_element.get_attribute('src') or
                        img_element.get_attribute('data-src') or
                        img_element.get_attribute('data-mimg')
                        # img_element.get_attribute('data-imgurl') or
                        # img_element.get_attribute('src') or
                        # img_element.get_attribute('data-original')
                    )
                    # print(f"[{link}] 获取链接属性...")
                    # 验证链接有效性
                    if link and link.startswith(('http://', 'https://','data:image/')):
                        emblem_links.append(link)
                        print(f"[{idx}/{total_schools}] 成功：{school_name} -> {link[:50]}...")
                        success = True
                        break
                    else:
                        raise ValueError("未获取到有效链接")

                except TimeoutException:
                    # 超时后尝试刷新页面重新获取
                    try:
                        print(f"[{idx}/{total_schools}] 重试{attempt+1}：{school_name} - 超时，等待后刷新...")
                        time.sleep(5)
                        driver.refresh()
                        time.sleep(5)
                        # 尝试直接查找图片元素
                        img_element = driver.find_element(
                            By.CSS_SELECTOR, 
                            '.slist .imgbox .imgitem img, .main_img, .img-hover'
                        )
                        link = img_element.get_attribute('data-imgurl') or img_element.get_attribute('src')
                        if link and link.startswith(('http://', 'https://')):
                            emblem_links.append(link)
                            print(f"[{idx}/{total_schools}] 成功（刷新后）：{school_name} -> {link[:50]}...")
                            success = True
                            break
                    except:
                        error_msg = "超时（刷新后仍失败）"

                except (NoSuchElementException, ValueError) as e:
                    error_msg = str(e)

                except WebDriverException as e:
                    if "invalid session id" in str(e).lower():
                        print(f"[{idx}/{total_schools}] 重试{attempt+1}：{school_name} - 会话失效，重启浏览器...")
                        driver.quit()
                        driver = create_edge_driver(driver_path)
                        continue
                    error_msg = f"浏览器错误：{str(e)[:30]}"

                # 输出重试信息（最后一次重试不提示）
                if attempt < 2:
                    print(f"[{idx}/{total_schools}] 重试{attempt+1}：{school_name} - {error_msg}")

            # 三次重试均失败
            if not success:
                emblem_links.append(None)
                print(f"[{idx}/{total_schools}] 失败：{school_name} - 三次重试均失败")

        # 5. 保存结果到Excel
        print(f"\n===== 处理完成 =====")
        df['校徽链接'] = emblem_links
        df.to_excel(output_excel_path, index=False, engine='openpyxl')
        success_count = len([x for x in emblem_links if x is not None])
        print(f"结果统计：成功{success_count}/{total_schools}，失败{total_schools - success_count}")
        print(f"结果文件：{output_excel_path}")

    except Exception as e:
        print(f"\n程序终止：{str(e)}")
    finally:
        # 确保浏览器关闭
        if 'driver' in locals() and driver is not None:
            print("\n关闭浏览器...")
            driver.quit()
            print("程序退出")

if __name__ == "__main__":
    main()