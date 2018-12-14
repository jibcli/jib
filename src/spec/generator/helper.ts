import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export const assertGeneratedFiles = (outputDir: string, files: string[]): void => {
  [outputDir]
    .concat(files.map(file => path.join(outputDir, path.normalize(file))))
    .forEach(file => {
      expect(fs.existsSync(file)).toBeTruthy(`${path.relative(outputDir, file)} not found`);
    });
};

export const assertPackageJson = (outputDir: string): any => {
  const p = (): any => require(path.join(outputDir, 'package.json'));
  expect(p).not.toThrow();
  return p();
};

export const assertValidTS = (file: string, target: ts.ScriptTarget = ts.ScriptTarget.ES2015): void => {
  const result = ts.transpileModule(fs.readFileSync(file).toString(), {
    compilerOptions: {
      target,
      module: ts.ModuleKind.CommonJS,
    },
  });
  expect(result.diagnostics.length).toBe(0);
};
