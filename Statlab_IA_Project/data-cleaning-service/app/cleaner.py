import pandas as pd

def clean_dataset(path):
    df = pd.read_csv(path)
    df.drop_duplicates(inplace=True)
    df.dropna(inplace=True)
    df.to_csv(path, index=False)
