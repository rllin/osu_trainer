import sys
import pickle
from scipy.stats import mstats
import rpy2.robjects as robjects
from rpy2.robjects import pandas2ri
import scipy.special as sse
import scipy.stats as sss
import scipy.optimize as so
import pandas as pd
import numpy as np
import seaborn as sns
from reportlab.pdfgen import canvas
pandas2ri.activate()
r = robjects.r


def winsor(s):
    return mstats.winsorize(s, limits=[0.01, 0.01])

f = sys.argv[1]
d = sys.argv[2]
#f = '20150729_170555_643_CSGO'
#d = './'
#data = pickle.load(open('20150729_170555_643_CSGO'))
data = pickle.load(open(f))
# pdf = lambda**a * x**(a-1) * exp(-lambda*x) / gamma(a)
# lambda = 1/b
# a = a
# l = location, shifts the distribution to the right

# generate estimates of the mean, variance, mode from the kde of each individual
data['empirvariance'] = data.apply(lambda x: np.var(x['combined']), axis=1)
data['mean'] = data.apply(lambda x: x['a'] * x['b'], axis=1)
data['variance'] = data.apply(lambda x: x['a'] * x['b'] * x['b'], axis=1)
data['logvariance'] = data.apply(lambda x: np.log(x['variance']), axis=1)
data['mode'] = data.apply(lambda x: (x['a'] - 1 ) * x['b'], axis=1)
data['skew'] = data.apply(lambda x: 2 / float(np.sqrt(x['a'])), axis=1)
data['kurtosis'] = data.apply(lambda x: 6 / float(x['a']), axis=1)

# replace outliers
wdata = data.apply(winsor)

# remove bad fits
wdata = wdata[wdata['p'] == 1]
wdata = wdata[wdata['rank'] >= 6]

# ANOVA
rdata = pandas2ri.py2ri(wdata)
avg_anova = r.anova(r.lm('avg ~ a * b * l', data=rdata)).__str__()
rank_anova = r.anova(r.lm('rank ~ a * b * l* chi * p', data=rdata)).__str__()
rank_small_anova = r.anova(r.lm('rank ~ a * b * l', data=rdata)).__str__()
rank_means_anova = r.anova(r.lm('rank ~ mean', data=rdata)).__str__()
rank_modevar_anova = r.anova(r.lm('rank ~ mode*variance', data=rdata)).__str__()
rank_logvar_anova = r.anova(r.lm('rank ~ logvariance', data=rdata)).__str__()

with open(d + 'anova_results.txt', 'w') as f:
    f.write(avg_anova + '\n')
    f.write(rank_anova + '\n')
    f.write(rank_small_anova + '\n')
    f.write(rank_means_anova + '\n')
    f.write(rank_modevar_anova + '\n')
    f.write(rank_logvar_anova + '\n')


# plots
# rank vs avg
sns.jointplot('rank', 'avg', wdata, kind='reg', color='seagreen')
sns.plt.text(6,800, '$n = $' + str(len(wdata)))
sns.plt.savefig(d + 'rank_vs_avg_' + str(len(wdata)) + '.pdf')

# rank vs empir var
sns.jointplot('rank', 'empirvariance', wdata, kind='reg', color='seagreen')
sns.plt.text(6,800, '$n = $' + str(len(wdata)))
sns.plt.savefig(d + 'rank_vs_empvar_' + str(len(wdata)) + '.pdf')

# rank vs variance
sns.jointplot('rank', 'variance', wdata, kind='reg', color='seagreen')
sns.plt.text(6, 9, '$n = $' + str(len(wdata)))
sns.plt.savefig(d + 'rank_vs_var_' + str(len(wdata)) + '.pdf')

# rank vs log variance
g = sns.jointplot('rank', 'variance', wdata, kind='reg', color='seagreen')
sns.plt.text(6, 9, '$n = $' + str(len(wdata)))
g.ax_joint.set_yscale('log')
g.ax_marg_y.set_yscale('log')
sns.plt.savefig(d + 'rank_vs_logvar_' + str(len(wdata)) + '.pdf')

