import os
import zipfile
from pathlib import Path

def pack_project():
    source_dir = Path(r"C:\Users\Admin\Downloads\cctv-forensic-platform")
    output_zip = Path(r"C:\Users\Admin\Downloads\cctv-forensic-platform-updated.zip")
    
    for out_path in [output_zip, Path(r"C:\Users\Admin\Downloads\cctv-forensic-platform.zip")]:
        print(f"Creating clean production archive at {out_path}...")
        with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(source_dir):
                # Skip node_modules, cache, dist, and zip files
                dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "__pycache__", ".vite")]
                for file in files:
                    if file.endswith((".pyc", ".pyo", ".zip")):
                        continue
                    full_path = Path(root) / file
                    rel_path = full_path.relative_to(source_dir)
                    zf.write(full_path, str(rel_path))
        
        size_mb = out_path.stat().st_size / (1024 * 1024)
        print(f"Archive created at {out_path}! Size: {size_mb:.2f} MB")

if __name__ == "__main__":
    pack_project()
