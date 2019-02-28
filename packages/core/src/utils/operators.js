import { Meta } from "../type-graph/meta/meta";
import { Type } from "../type-graph/types/type";
import { Scope } from "../type-graph/scope";
import { TypeVar } from "../type-graph/types/type-var";
import { UnionType } from "../type-graph/types/union-type";
import { ObjectType } from "../type-graph/types/object-type";
import { TYPE_SCOPE } from "../type-graph/constants";
import { GenericType } from "../type-graph/types/generic-type";
import { ModuleScope } from "../type-graph/module-scope";
import { FunctionType } from "../type-graph/types/function-type";
import { VariableInfo } from "../type-graph/variable-info";
import { findVariableInfo } from "./variable-utils";

const zeroMetaLocation = new Meta();

const genericFunction = (
  typeScope,
  genericArguments,
  getTypeParameters,
  getReturnType
) => {
  const localTypeScope = new Scope(Scope.BLOCK_TYPE, typeScope);
  genericArguments.forEach(([key, type]) => {
    localTypeScope.body.set(
      key,
      new VariableInfo(type, localTypeScope)
    );
  });
  genericArguments = genericArguments.map(([, t]) => t);
  const parametersTypes = getTypeParameters(localTypeScope);
  const returnType = getReturnType(localTypeScope);
  return GenericType.createTypeWithName(
    FunctionType.getName(parametersTypes, returnType, genericArguments),
    typeScope,
    genericArguments,
    localTypeScope,
    FunctionType.createTypeWithName(
      FunctionType.getName(parametersTypes, returnType),
      localTypeScope,
      parametersTypes,
      returnType
    )
  );
};

const mixBaseOperators = moduleScope => {
  const typeScope = moduleScope.body.get(TYPE_SCOPE);
  const operators = new Map(
    [
      [
        "+",
        FunctionType.createTypeWithName(
          "(mixed) => number",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "-",
        FunctionType.createTypeWithName(
          "(mixed) => number",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "!",
        FunctionType.createTypeWithName(
          "(mixed) => boolean",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("boolean", typeScope)
        )
      ],
      [
        "~",
        FunctionType.createTypeWithName(
          "(number) => number",
          typeScope,
          [Type.createTypeWithName("number", typeScope)],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "typeof",
        FunctionType.createTypeWithName(
          "(mixed) => string",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("string", typeScope)
        )
      ],
      [
        "void",
        FunctionType.createTypeWithName(
          "(mixed) => undefined",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("string", typeScope)
        )
      ],
      [
        "delete",
        FunctionType.createTypeWithName(
          "(mixed) => undefined",
          typeScope,
          [Type.createTypeWithName("mixed", typeScope)],
          Type.createTypeWithName("undefined", typeScope)
        )
      ],
      // [
      // "await",
      // genericFunction(typeScope, [["T", new Type("T")]], [[]]),
      // GenericType.createTypeWithName(
      //   "<T>(Promise<T>) => <T>",
      //   typeScope,
      //   typeScope,
      //   AwaitDeclaration
      // )
      // ],
      [
        "==",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "===",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "!==",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "!=",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        ">=",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "<=",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        ">",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "<",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => Type.createTypeWithName("boolean", l)
        )
      ],
      [
        "+<number>",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "+<string>",
        FunctionType.createTypeWithName(
          "(string, string) => string",
          typeScope,
          [
            Type.createTypeWithName("string", typeScope),
            Type.createTypeWithName("string", typeScope)
          ],
          Type.createTypeWithName("string", typeScope)
        )
      ],
      [
        "-",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "/",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "%",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "|",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "&",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "*",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "^",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "**",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "<<",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        ">>",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        ">>>",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "in",
        FunctionType.createTypeWithName(
          "(string, Object) => boolean",
          typeScope,
          [
            Type.createTypeWithName("string", typeScope),
            Type.createTypeWithName("Object", typeScope)
          ],
          Type.createTypeWithName("boolean", typeScope)
        )
      ],
      [
        "instanceof",
        FunctionType.createTypeWithName(
          "(mixed, mixed) => boolean",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "=",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type, l.body.get("T").type],
          l => l.body.get("T").type
        )
      ],
      [
        "+=<string>",
        FunctionType.createTypeWithName(
          "(string, string) => string",
          typeScope,
          [
            Type.createTypeWithName("string", typeScope),
            Type.createTypeWithName("string", typeScope)
          ],
          Type.createTypeWithName("string", typeScope)
        )
      ],
      [
        "+=<number>",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "-=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "*=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "/=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "%=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "**=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        ">>=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        ">>>=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "<<=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "|=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "&=",
        FunctionType.createTypeWithName(
          "(number, number) => number",
          typeScope,
          [
            Type.createTypeWithName("number", typeScope),
            Type.createTypeWithName("number", typeScope)
          ],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      // Updates
      [
        "++",
        FunctionType.createTypeWithName(
          "(number) => number",
          typeScope,
          [Type.createTypeWithName("number", typeScope)],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        "--",
        FunctionType.createTypeWithName(
          "(number) => number",
          typeScope,
          [Type.createTypeWithName("number", typeScope)],
          Type.createTypeWithName("number", typeScope)
        )
      ],
      [
        // Logical
        "&&",
        genericFunction(
          typeScope,
          [["A", new TypeVar("A")], ["B", new TypeVar("B")]],
          l => [l.body.get("A").type, l.body.get("B").type],
          l =>
            UnionType.createTypeWithName("A | B", l, [
              l.body.get("A").type,
              l.body.get("B").type
            ])
        )
      ],
      [
        "||",
        genericFunction(
          typeScope,
          [["A", new TypeVar("A")], ["B", new TypeVar("B")]],
          l => [l.body.get("A").type, l.body.get("B").type],
          l =>
            UnionType.createTypeWithName("A | B", l, [
              l.body.get("A").type,
              l.body.get("B").type
            ])
        )
      ],
      [
        "?:",
        genericFunction(
          typeScope,
          [["A", new TypeVar("A")], ["B", new TypeVar("B")]],
          l => [
            Type.createTypeWithName("boolean", typeScope),
            l.body.get("A").type,
            l.body.get("B").type
          ],
          l =>
            UnionType.createTypeWithName("A | B", l, [
              l.body.get("A").type,
              l.body.get("B").type
            ])
        )
      ],
      [
        "if",
        FunctionType.createTypeWithName(
          "(boolean) => void",
          typeScope,
          [Type.createTypeWithName("boolean", typeScope)],
          Type.createTypeWithName("void", typeScope)
        )
      ],
      [
        "while",
        FunctionType.createTypeWithName(
          "(boolean) => void",
          typeScope,
          [Type.createTypeWithName("boolean", typeScope)],
          Type.createTypeWithName("void", typeScope)
        )
      ],
      [
        "do-while",
        FunctionType.createTypeWithName(
          "(boolean) => void",
          typeScope,
          [Type.createTypeWithName("boolean", typeScope)],
          Type.createTypeWithName("void", typeScope)
        )
      ],
      [
        "for",
        FunctionType.createTypeWithName(
          "(?mixed, ?boolean, ?mixed) => void",
          typeScope,
          [
            Type.createTypeWithName("mixed", typeScope),
            Type.createTypeWithName("boolean", typeScope),
            Type.createTypeWithName("mixed", typeScope)
          ],
          Type.createTypeWithName("void", typeScope)
        )
      ],
      [".", typeScope.body.get("$PropertyType").type],
      [
        "return",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type],
          l => l.body.get("T").type
        )
      ],
      [
        "new",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type],
          l => l.body.get("T").type
        )
      ],
      [
        "throw",
        genericFunction(
          typeScope,
          [["T", new TypeVar("T")]],
          l => [l.body.get("T").type],
          l => l.body.get("T").type
        )
      ]
    ].map(([name, type]) => [
      name,
      new VariableInfo(type, typeScope, zeroMetaLocation)
    ])
  );
  moduleScope.body = new Map([...moduleScope.body, ...operators]);
};

export default mixBaseOperators;