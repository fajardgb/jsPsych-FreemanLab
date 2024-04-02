import pandas as pd
import matplotlib.pyplot as plt
import json

file_name = "VideoSliderContinuousResponse/output/sub-374005_data.csv"

df = pd.read_csv(file_name)
df = df[df['trial_name'] == 'video']
responses = df['response']

num = 1

for index, row in df.iterrows():
    response = row['response']
    response_list = json.loads(response)
    response_df = pd.DataFrame(response_list)
    response_df['value'] = pd.to_numeric(response_df['value'])
    response_df['time'] = pd.to_numeric(response_df['time'])
    response_df.plot(x='time', y='value', marker='o', linestyle='-')
    print(response_df)
    plt.xlabel('Time')
    plt.ylabel('Value')
    plt.title('Line Graph of Points')
    plt.grid(True)
    plt.savefig('VideoSliderContinuousResponse/line_graph' + str(num) + '.png')
    num += 1
    
