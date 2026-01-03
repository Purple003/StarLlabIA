import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def analyze_file(file_path):
    df = pd.read_csv(file_path)
    summary = df.describe().to_dict()  # statistiques de base
    # Exemple : regression simple si colonne 'x' et 'y'
    if "x" in df.columns and "y" in df.columns:
        model = LinearRegression()
        model.fit(df[["x"]], df["y"])
        summary["regression_coef"] = model.coef_[0]
        summary["regression_intercept"] = model.intercept_
    return summary
