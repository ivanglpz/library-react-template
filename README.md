![alt text](https://res.cloudinary.com/whil/image/upload/v1725205735/app/library-template/images/publishlibrary_r15d1h.png)

# Crea y Publica una Librería con React en npm

Este artículo te explicará todo acerca de la instalación, configuración y publicación de una librería con React y TypeScript. Voy a usar el empaquetador Rollup con TypeScript. ¡Espero que te sea útil!

## Instalación

En este caso, usaré Next.js v13, pero también puedes utilizar Vite o Astro. Solo lo usaremos para desarrollar nuestros componentes, hooks, utilidades, etc.

Enlace: https://nextjs.org/docs/getting-started/installation

```
npx create-next-app@latest
```

```javascript
What is your project named? my-app
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? No
Would you like your code inside a `src/` directory? Yes
Would you like to use App Router? (recommended) No
Would you like to use Turbopack for `next dev`? No
Would you like to customize the import alias (`@/*` by default)? Yes
What import alias would you like configured? @/\*
```

Luego, debes instalar este paquete de forma global en tu computadora. np es un paquete que permite automatizar todo el proceso de publicación de una librería. Por ejemplo, reinstala las dependencias, ejecuta los tests, aumenta la versión del package.json, crea una etiqueta de la versión en Git y publica la versión en npm.

Enlace: https://www.npmjs.com/package/np

```javascript
npm install --global np
```

Luego, debes instalar las siguientes librerías como devDependencies.

```json
{
  /// rest config
  "dependencies": {
    "eslint": "8.30.0",
    "next": "13.1.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tslib": "^2.5.3",
    "typescript": "4.9.4"
  },
  "devDependencies": {
    "@rollup/plugin-alias": "^5.0.0",
    "@rollup/plugin-commonjs": "^24.0.1",
    "@rollup/plugin-inject": "^5.0.3",
    "@rollup/plugin-json": "^6.0.0",
    "@rollup/plugin-node-resolve": "^15.0.2",
    "@rollup/plugin-typescript": "^11.1.0",
    "@types/node": "18.11.18",
    "@types/react": "18.0.26",
    "@types/react-dom": "18.0.10",
    "global": "^4.4.0",
    "rollup": "2.68.0",
    "rollup-plugin-alias": "^2.2.0",
    "rollup-plugin-multi-entry": "^2.1.0",
    "rollup-plugin-node-polyfills": "^0.2.1",
    "rollup-plugin-peer-deps-external": "^2.2.4",
    "rollup-plugin-polyfill-node": "^0.8.0",
    "rollup-plugin-typescript2": "0.34.1"
  }
}
```

@rollup/plugin-alias: Este plugin permite crear alias para rutas en tu proyecto, lo que facilita las importaciones. Por ejemplo, en lugar de escribir rutas largas o complejas, puedes definir alias como @components para referirte a una carpeta de componentes.

@rollup/plugin-commonjs: Permite que Rollup convierta módulos CommonJS (el sistema de módulos utilizado en Node.js) a ESModules (el estándar moderno para módulos en JavaScript). Esto es útil cuando trabajas con dependencias que están escritas en formato CommonJS.

@rollup/plugin-inject: Este plugin permite inyectar variables globales automáticamente en los módulos donde se necesitan. Por ejemplo, si un módulo necesita process o Buffer, este plugin puede inyectar esas variables sin necesidad de importarlas explícitamente en cada archivo.

@rollup/plugin-json: Permite a Rollup importar archivos JSON como si fueran módulos. Esto es útil cuando quieres manejar datos JSON directamente en tu código sin tener que hacer peticiones para obtenerlos.

@rollup/plugin-node-resolve: Este plugin permite que Rollup resuelva módulos desde node_modules. Esto es esencial cuando estás trabajando con dependencias externas que están instaladas en node_modules.

@rollup/plugin-typescript: Añade soporte para TypeScript en Rollup, permitiendo que compile archivos .ts y .tsx como parte de tu proceso de build.

global: Esta librería define un objeto global para entornos que no lo tienen, lo que puede ser necesario cuando estás trabajando en un entorno que no es Node.js y necesitas un objeto global similar.

rollup: Es el empaquetador principal para crear el bundle del proyecto. Rollup toma tus módulos y los combina en un solo archivo, optimizando el código en el proceso.

El resto de las librerías son complementos de las librerías principales. Esto es útil al momento de hacer un build.

## Configuración

1. package.json
   package.json Tienes que configurar los siguientes campos. Esto permitirá indicarle a npm qué carpeta usar, qué archivos incluir y el nombre que llevará la librería, así como los comandos.

```json
{
  "engines": {
    "node": ">=20"
  },
  "files": ["build"],
  "license": "UNLICENSED",
  "main": "build/index.js",
  "name": "@whil/library-template",
  "description": "A template for creating libraries with react by @ivanglpz",
  "peerDependencies": {},
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "scripts": {
    "rollup": "rollup -c",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start -p 3001",
    "test": "rollup -c",
    "build": "next build",
    "publish_np": "np --no-cleanup"
  },
  "types": "./build\\index.d.ts",
  "version": "0.0.0"
  //rest config
}
```

El campo name es el nombre que aparecerá en npm después de subirlo. Debes colocar el nombre de la cuenta que está publicando, seguido del nombre del paquete: @[mynamenpm]/module.

Los scripts importantes son:

Rollup: Crea el código final que se enviará a npm.

publish_np: Permite ejecutar np listo para publicar en npm.

test: np necesita un script para verificar si el código funciona. En este caso, he utilizado el mismo script de Rollup: -c.

2. rollup.config.js
   Al ejecutar el script test o rollup, necesitas este archivo de configuración en la carpeta raíz de tu proyecto, fuera de la carpeta src.

```javascript
rollup.config.js;

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import alias from "rollup-plugin-alias";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";

const config = [
  {
    input: "index.ts",
    output: [
      {
        file: "build/index.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      peerDepsExternal(),
      alias({
        applicationRoot: `${__dirname}`,
      }),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: "tsconfig-rollup.json",
      }),
    ],
  },
];

export default config;
```

Este script indica que Rollup tomará index.ts como punto de entrada, y el punto de salida será en la carpeta build. Los plugins permiten exportar los tipos, archivos JSON, alias, y las dependencias externas que utilicemos en nuestros módulos, y estarán disponibles en el paquete final.

tsconfig-rollup.json
Crea un archivo JSON y nomínalo tsconfig-rollup.json. Este archivo toma la configuración de tsconfig y la extiende con opciones de JSX, en este caso para React.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  },
  "extends": "./tsconfig.json"
}
```

2. tsconfig.json
   Esta configuración de TypeScript permite indicar dónde se guardarán nuestros tipos después del build de Rollup. En este caso, se guardarán en la misma carpeta build.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationDir": "build",
    "downlevelIteration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext", "es6", "es2016", "es2017"],
    "module": "esnext",
    "moduleResolution": "node",
    "noEmit": true,
    "paths": {
      "@/_": ["./src/_"]
    },
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "target": "ESNext"
  },
  "exclude": ["node_modules", "build"],
  "include": ["**/*", "**/*x", "**/*.d.ts"]
}
```

3. .np-config.js
   Este archivo indica únicamente cómo se ejecutarán las reinstalaciones y los tests.

```javascript
module.exports = {
  yarn: false,
  test: false,
  "2fa": false,
  cleanup: false,
  npm: false,
};
```

Estas son todas las propiedades que puede utilizar np. Revisa cuál se adapta mejor a tus requisitos.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205484/app/library-template/images/image_bsfzcq.png)

## Creación del módulo

Crea un archivo index.ts. Este será el punto de entrada de Rollup para compilar el módulo.

```javascript
index.ts;

export * from "./src/@atoms";
export * from "./src/@hooks";
```

Para este ejemplo, voy a usar Atomic Design y voy a crear un botón y un hook. Utilizaré el Barrel Pattern de TypeScript, que permite que, en el futuro, si agrego más componentes o hooks, pueda simplemente añadirlos al archivo de @hooks o @atoms.

```javascript
root/
│
├── @atoms/
│   └── AtomButton/
│       └── index.tsx
│   ├── index.ts
├── @hooks/
│   ├── index.ts
│   └── useTimer.ts
│
└── pages/
```

Y este será mi componente: un simple botón con "Hello World".

```javascript
export const AtomButton = () => {
  return <button>hello world</button>;
};
```

Y lo importo en @atoms/index.ts.

```javascript
export { AtomButton } from "./AtomButton";
```

Y mi hook será useDebounce.

```javascript
import { useEffect, useState } from "react";

type Props = {
  callback: () => void,
  ms?: number,
  end?: number,
};

export const useDebounce = (props: Props) => {
  const { callback, ms, end } = props;
  const [timer, setTimer] = useState(3);

  const [load, setLoad] = useState(true);
  useEffect(() => {
    const intervalTimer = setInterval(() => {
      if (timer === (end ?? 3)) {
        if (!load) {
          callback?.();
        }
        setLoad(true);
        clearTimeout(intervalTimer);
      } else {
        setLoad(false);
        setTimer((prev) => prev + 1);
      }
    }, ms ?? 1000);

    return () => clearInterval(intervalTimer);
  }, [timer]);

  return {
    timer,
    ms,
    end,
    setTimer,
    load,
    setLoad,
  };
};
```

Y lo importo en @hooks/index.ts.

```javascript
export { useTimer } from "./useTimer";
```

¡Listo! Ahora, sube los cambios a tu repositorio.

## Publicar en npm

Dirígete a la página de npm, en la sección de Access Tokens: https://www.npmjs.com/settings/test/tokens, y crea un nuevo token de tipo Classic Token.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205484/app/library-template/images/image-1_vcjzed.png)

Este nuevo token debe ser de tipo "Publish" para que puedas publicar paquetes. También te pedirá que tengas habilitada la autenticación de dos factores (2FA).

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205485/app/library-template/images/image-2_at2f4t.png)

Luego, copia este nuevo token y crea un archivo .npmrc.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205484/app/library-template/images/image-3_cljw0e.png)

Este archivo .npmrc debe estar en la carpeta principal de tu proyecto. En Windows, la ruta es:

C:\Users\<TuUsuario>\.npmrc

```json
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=TU TOKEN DE NPM SIN COMILLAS TODO JUNTO
```

Este archivo lo usará np para realizar la publicación del paquete.

### Compilar

Debes ejecutar el script Rollup, y debería mostrarte un mensaje como este. Asegúrate de tener todos tus cambios subidos a tu repositorio.
![alt text](https://res.cloudinary.com/whil/image/upload/v1725205484/app/library-template/images/image-4_dy238k.png)

Ahora, ejecuta el script publish_np. Este script, al principio, te preguntará si todos los archivos que te enlistará serán incluidos. Acepta que sí.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205485/app/library-template/images/image-5_w757zx.png)

Luego, te pedirá que indiques qué tipo de versión es: puede ser patch, minor, major o prepatch. En mi caso, es un patch. Si no estás seguro de qué tipo de versión debes utilizar, te recomiendo leer este documento que lo explica con más detalle: https://semver.org/#semantic-versioning-specification-semver.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205484/app/library-template/images/image-6_wheche.png)

Aquí debes ingresar el código de autenticación de dos factores (2FA) que posee tu cuenta. Esto es requerido por npm.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205488/app/library-template/images/image-7_ytygl8.png)

¡Y listo! El paquete ya está en npm y puedes utilizarlo en cualquier proyecto.

![alt text](https://res.cloudinary.com/whil/image/upload/v1725205490/app/library-template/images/image-8_yp9xx1.png)

¡Gracias por leer!

Espero que esta guía te haya sido de gran ayuda. Ha sido un articulo extenso y detallado, y me encantaría que más personas pudieran beneficiarse de esta información. Si te ha gustado, te invito a compartirlo y a darle un "me gusta". ¡Tu apoyo es invaluable y me motiva a seguir creando contenido de calidad!

ツ
