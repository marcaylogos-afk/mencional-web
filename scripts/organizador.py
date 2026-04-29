import os
import shutil
import re
from collections import defaultdict
from datetime import datetime

# --- CONFIGURACIÓN MENCIONAL 2026 ---
# Se apunta a la raíz del proyecto para organizar reportes de sesiones
BASE_DIR = r"C:\Mencional"
# Patrón para capturar fecha, hora y el indicador am/pm (a_m o p_m)
DATE_PATTERN = re.compile(r"(\d{2}_\d{2}_\d{4}_\d{2}_\d{2}_[ap]_m)")
# El directorio de reportes se mantiene separado de la lógica /ai/
REPORT_DIR = os.path.join(BASE_DIR, "reportes")

# 🛡️ LISTA BLANCA: Carpetas que NUNCA deben ser movidas o escaneadas
# Se incluye 'ai' para proteger los servicios de inteligencia artificial
IGNORE_DIRS = {"ai", "backend", "functions", "node_modules", "public", "src", "reportes"}

def organizar_archivos():
    print(f"🚀 Iniciando organización en Nodo: {BASE_DIR}")
    print(f"🧠 Carpeta de servicios protegida: /ai/\n")
    
    grouped_files = defaultdict(list)

    if not os.path.exists(BASE_DIR):
        print(f"🛑 Error: La ruta {BASE_DIR} no existe.")
        return

    # 1. Escaneo y Agrupación con Protección de Directorios
    for filename in os.listdir(BASE_DIR):
        file_path = os.path.join(BASE_DIR, filename)
        
        # Omitir si es un directorio protegido (como la nueva carpeta /ai/)
        if os.path.isdir(file_path) and filename.lower() in IGNORE_DIRS:
            continue
            
        # Omitir archivos sueltos que no sean datos de sesión
        if os.path.isfile(file_path):
            match = DATE_PATTERN.search(filename)
            if match:
                key = match.group(1)
                grouped_files[key].append(filename)

    if not grouped_files:
        print("⚠️ No se encontraron archivos de sesión pendientes de organizar.")
        return

    # 2. Procesamiento de Grupos (DNG/XMP de capturas de sesión)
    for key, files in grouped_files.items():
        folder_name = key.replace("_", "-")
        target_path = os.path.join(BASE_DIR, "sesiones", folder_name)
        os.makedirs(target_path, exist_ok=True)

        dng_files = [f for f in files if f.lower().endswith(".dng")]
        xmp_files = [f for f in files if f.lower().endswith(".xmp")]

        for f in dng_files + xmp_files:
            try:
                src = os.path.join(BASE_DIR, f)
                dst = os.path.join(target_path, f)
                shutil.move(src, dst)
            except Exception as e:
                print(f"🛑 Error moviendo datos de sesión {f}: {e}")

        # 3. Validación de Integridad (Sincronización DNG/XMP)
        dng_basenames = {os.path.splitext(f)[0] for f in dng_files}
        xmp_basenames = {os.path.splitext(f)[0] for f in xmp_files}

        missing_xmp = dng_basenames - xmp_basenames
        missing_dng = xmp_basenames - dng_basenames

        # 4. Reporte de Inconsistencias
        if missing_xmp or missing_dng:
            os.makedirs(REPORT_DIR, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

            if missing_xmp:
                report_file = os.path.join(REPORT_DIR, f"missing_xmp_{folder_name}.txt")
                with open(report_file, "w", encoding="utf-8") as rf:
                    rf.write(f"--- SESIÓN {folder_name}: DNG SIN METADATOS XMP ---\n")
                    rf.write("\n".join(sorted(missing_xmp)))

            if missing_dng:
                report_file = os.path.join(REPORT_DIR, f"missing_dng_{folder_name}.txt".txt")
                with open(report_file, "w", encoding="utf-8") as rf:
                    rf.write(f"--- SESIÓN {folder_name}: XMP HUÉRFANOS ---\n")
                    rf.write("\n".join(sorted(missing_dng)))

    print("\n✅ Organización de sesiones completada.")
    print("✅ Directorio /ai/ verificado y seguro.")

if __name__ == "__main__":
    organizar_archivos()