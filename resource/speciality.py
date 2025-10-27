import requests
import json

def get_all_data():
    base_url = "https://xz.chsi.com.cn/speciality/list.action"
    params = {
        "phbType": 1,
        "cc": "",
        "ml": "",
        "xk": "",
        "zymc": "",
        "start": 0  # 分页起始参数
    }
    
    all_data = []  # 存储所有数据
    page_size = 15  # 假设每页20条（需根据实际返回调整）
    
    while True:
        try:
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()  # 检查请求是否成功
            full_json = response.json()  # 解析完整JSON（包含外层结构）
            
            # 提取嵌套在 data 字段中的实际数据（若字段不存在，默认空列表）
            current_page_data = full_json.get("data", {})
            pageArray = current_page_data.get("pageArray", [])
            
            # 若当前页数据为空，说明已无更多内容
            if not pageArray:
                break
            
            # 添加当前页数据到总列表
            all_data.extend(pageArray)
            
            # 若当前页数据小于分页大小，说明是最后一页
            if len(pageArray) < page_size:
                break
            
            # 递增 start 参数，请求下一页
            params["start"] += page_size
            
        except Exception as e:
            print(f"请求出错：{e}")
            break
    
    return all_data

# 调用函数
result = get_all_data()
print(f"共获取 {len(result)} 条数据")
# 保存结果
with open("all_data.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)    