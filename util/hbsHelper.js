const Handlebars = require("handlebars");
module.exports = {
  forInRange: function (from, to, incr, block) {
    var accum = "";
    for (var i = from; i <= to; i += incr) accum += block.fn(i);
    return accum;
  },
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);

      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);

      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);

      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);

      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);

      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);

      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);

      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);

      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);

      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);

      default:
        return eval("" + v1 + operator + v2)
          ? options.fn(this)
          : options.inverse(this);
    }
  },
};
