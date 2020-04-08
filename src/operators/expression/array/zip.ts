// Array Expression Operators: https://docs.mongodb.com/manual/reference/operator/aggregation/#array-expression-operators

import { assert, isArray, isBoolean, isNil, truthy } from '../../../util'
import { computeValue, Options } from '../../../core'

/**
 * Merge two lists together.
 *
 * Transposes an array of input arrays so that the first element of the output array would be an array containing,
 * the first element of the first input array, the first element of the second input array, etc.
 *
 * @param  {Obj} obj
 * @param  {*} expr
 * @return {*}
 */
export function $zip(obj: object, expr: any, ctx: Options): any {
  let inputs = computeValue(obj, expr.inputs, null, ctx)
  let useLongestLength = expr.useLongestLength || false

  assert(isArray(inputs), "'inputs' expression must resolve to an array")
  assert(isBoolean(useLongestLength), "'useLongestLength' must be a boolean")

  if (isArray(expr.defaults)) {
    assert(truthy(useLongestLength), "'useLongestLength' must be set to true to use 'defaults'")
  }

  let zipCount = 0

  for (let i = 0, len = inputs.length; i < len; i++) {
    let arr = inputs[i]

    if (isNil(arr)) return null

    assert(isArray(arr), "'inputs' expression values must resolve to an array or null")

    zipCount = useLongestLength
      ? Math.max(zipCount, arr.length)
      : Math.min(zipCount || arr.length, arr.length)
  }

  let result = []
  let defaults = expr.defaults || []

  for (let i = 0; i < zipCount; i++) {
    let temp = inputs.map((val: any, index: number) => {
      return isNil(val[i]) ? (defaults[index] || null) : val[i]
    })
    result.push(temp)
  }

  return result
}
