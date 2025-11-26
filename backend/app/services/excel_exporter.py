import pandas as pd
from pathlib import Path
def export_results(data: dict, result_id: str):
    out_dir = Path("results")
    out_dir.mkdir(exist_ok=True)
    df = pd.DataFrame([data])
    out_file = out_dir / f"result_{result_id}.xlsx"
    df.to_excel(out_file, index=False)
    return str(out_file)
