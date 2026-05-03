from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def normalize_target(series):
    values = sorted(series.dropna().unique().tolist())
    if values == [1, 2]:
        return series.map(lambda x: 1 if x == 1 else 0)
    return series


def build_pipeline(features, estimator):
    categorical = [col for col in features.columns if features[col].dtype == "object"]
    numeric = [col for col in features.columns if col not in categorical]
    preprocessor = ColumnTransformer(
        [
            ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), numeric),
            ("cat", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))]), categorical),
        ]
    )
    return Pipeline([("prep", preprocessor), ("model", estimator)])
