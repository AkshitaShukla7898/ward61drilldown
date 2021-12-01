from django.shortcuts import render
import pandas as pd

# Create your views here.

data=pd.read_csv('resources/data.csv')

dft=data.copy()
region_data = dft.groupby(['region'], as_index=False)['totalwaste','wetwaste','drywaste'].sum()
reg=region_data.to_dict('records')

cluster_data = dft.groupby(['building_cluster'], as_index=False)['totalwaste','wetwaste','drywaste'].sum()
cd=cluster_data.to_dict('records')
building_data = dft.groupby(['name'], as_index=False)['totalwaste','wetwaste','drywaste'].sum()
bd=building_data.to_dict('records')
print(bd)

def home(request):
    return render(request, "index.html",{'rd' : reg, 'cd': cd, 'bd':bd})