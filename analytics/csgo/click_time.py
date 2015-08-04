import grab_data as gd
import seaborn as sns
import pandas as pd
import numpy as np
from scipy.stats import mstats

st = gd.Study('ec2-52-25-109-156.us-west-2.compute.amazonaws.com:27017', 'target', 'targets', 'CS:GO', 1300)


avg_time = []
rank = []
for email, p in st.participants.items():
    avg_time.append(np.mean(p.time_to_clicks()))
    rank.append(p.rank)


data = pd.DataFrame({'rank': rank, 'avg_times': avg_time})
print data

def winsor(s):
    return mstats.winsorize(s, limits=[0.01, 0.01])

wdata = data.apply(winsor)

sns.jointplot('rank', 'avg_times', wdata, kind='reg', color='seagreen')
sns.plt.text(5, 800, '$n = $' + str(len(wdata)))
sns.plt.savefig('./average_time_' + str(len(wdata)) + '.pdf')


