import pandas as pd
import matplotlib.pyplot as plt
import json

file_name = "MouseTracking/output/sub-119570_data.csv"

df = pd.read_csv(file_name)
df = df[df['trial_name'] == 'mouseTrackQuestion']
# button_order = df['button_order'].iloc[0]
# cleaned_df = df[['rt', 'response','mouse_tracking_data', 'too_fast', 'too_slow']]

num = 1

for mouse_data in df['mouse_tracking_data']:
    # Convert data
    mouse_data_df = pd.DataFrame(json.loads(mouse_data))

    # Plot
    plt.figure()
    plt.plot(mouse_data_df['x'], mouse_data_df['y'], marker='o', markersize=4, linestyle='-', color='blue')
    plt.xlim(0, 1280) 
    plt.ylim(0, 720) 
    plt.gca().invert_yaxis() # Invert y-axis so 0 is at the top
    plt.gca().set_aspect('equal', adjustable='box') # Ensure x-axis and y-axis are proportional
    plt.grid(True)
    plt.savefig(f"MouseTracking/output/mouse_tracking_{num}.png", bbox_inches='tight')
    num += 1;