# Model Structure

Guía para los modelos de cuestionarios

## Checklist (Base)
- Status: 'Activo', 'En análisis', 'Concluido', 'Aprobado'
- Areas: Lista
    - Name: Descripcion del area con secciones de preguntas
    - Items
        - Tipo: Opciones como 'Numero', 'Date', 'Seleccion'
        - Descripcion: Descripcion de pregunta
        - Complemento: 
            - Nombre: 'Archivos Adjuntos'
            - Flag enable: True: Contestado
            - Evidencias: Lista

## Evidencia
- Tipo: `1` Imagen
- Path: Ruta de imagen, pdf