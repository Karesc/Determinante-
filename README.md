# El determinante 

El determinante de una matriz es mucho más que una fórmula algebraica con productos y restas: es la medida del cambio de tamaño que sufre el espacio al transformarse.Desde una perspectiva geométrica, el determinante representa el factor de escala de volumen de una transformación lineal:
* En 2D (matrices de $2 \times 2$): El valor absoluto del determinante es el área del paralelogramo formado por los vectores columna (o fila) de la matriz.
* En 3D (matrices de $3 \times 3$): Es el volumen del paralelepípedo definido por sus tres vectores.
* En $n$ dimensiones: Representa el hipervolumen $n$-dimensional de la figura formada por dichos vectores.

¿Qué nos dice el signo y el valor?
* $\vert{}\det(A)\vert{} > 1$: La transformación expande el área o volumen.
* $\vert{}\det(A)\vert{} < 1$: La transformación contrae el espacio.
* $\det(A) = 0$: La transformación aplasta el espacio a una dimensión inferior (una línea o un punto en 2D, un plano o línea en 3D), haciendo perder información y volviendo a la matriz no invertible.
* El signo (+ o -): Indica si la orientación del espacio se conserva o se invierte (como mirarse en un espejo).
