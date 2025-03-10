## Ejecución del script k6-stress-test en Windows

Para ejecutar el script `k6-stress-test` en Windows utilizando la consola, sigue estos pasos:

1. **Instalar k6**: Si no tienes k6 instalado, descárgalo e instálalo desde [k6.io](https://k6.io/docs/getting-started/installation/).

2. **Abrir la consola**: Abre la consola de comandos (CMD) o PowerShell.

3. **Navegar al directorio del script**: Utiliza el comando `cd` para navegar al directorio donde se encuentra el script `k6-stress-test.js`.

    ```sh
    cd ruta/al/directorio
    ```

4. **Ejecutar el script**: Ejecuta el script utilizando el comando `k6 run`.

    ```sh
    k6 run k6-stress-test.js
    ```

Esto iniciará la prueba de estrés utilizando k6 y mostrará los resultados en la consola.