import json
import csv

# 从 JSON 文件读取数据
json_file = '10-29-00的7日问题数据-10000.json'  # 替换为你的 JSON 文件名

with open(json_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# 提取需要的字段
extracted_data = []
for item in data['search_list']:
    extracted_data.append({
        '问题': item['question_title'],
        '浏览量': item['pv'],
        '关注量': item['follow'],
        '回答量': item['answer_counting'],
        '赞同量': item['answer_vote_ups'],
        '点击率': item['click_rate']
    })

# 指定 CSV 文件名
csv_file = 'zhihu.csv'

# 写入 CSV 文件
with open(csv_file, mode='w', newline='', encoding='utf-8-sig') as file:
    writer = csv.DictWriter(file, fieldnames=extracted_data[0].keys())
    writer.writeheader()
    writer.writerows(extracted_data)

print(f"数据已成功写入 {csv_file}")