function token(type, value) {
  this.type = type;
  this.value = value;
}

function lexer(text) {
  this.text = text;
  this.position = 0;
  this.currentChar = this.text[this.position];

  this.id_list = []
  this.constants_list = []

  this.separators_list = [
    '+',
    '-',
    '*',
    '/',
    '.',
    ',',
    ':',
    ';',
    '=',
    '<',
    '<=',
    '>',
    '>=',
    ':=',
    '(',
    ')',
    '[',
    ']'
  ]

  this.reservedKeywords_list = [
    'BEGIN',
    'END',
    'PROGRAM',
    'VAR',
    'INTEGER',
    'REAL',
    'ELSE',
    'IF',
    'THEN',
    'DIV',
    'REPEAT',
    'CASE',
    'SWITCH',
    'ARRAY',
    'WHILE',
    'DO',
    'UNTIL',
    'OF',
    'PROCEDURE',
    'OR'
  ]

  this.reservedKeywords = {
    BEGIN: new token("BEGIN", "BEGIN"),
    END: new token("END", "END"),
    PROGRAM: new token("PROGRAM", "PROGRAM"),
    VAR: new token("VAR", "VAR"),
    INTEGER: new token("INTEGER", "INTEGER"),
    REAL: new token("REAL", "REAL"),
    ELSE: new token("ELSE", "ELSE"),
    IF: new token("IF", "IF"),
    THEN: new token("THEN", "THEN"),
    DIV: new token("DIV", "DIV"),
    REPEAT: new token("REPEAT", "REPEAT"),
    CASE: new token("CASE", "CASE"),
    SWITCH: new token("SWITCH", "SWITCH"),
    ARRAY: new token("ARRAY", "ARRAY"),
    WHILE: new token("WHILE", "WHILE"),
    DO: new token("DO", "DO"),
    UNTIL: new token("UNTIL", "UNTIL"),
    OF: new token("OF", "OF"),
    PROCEDURE: new token("PROCEDURE", "PROCEDURE"),
    OR: new token("OR", "OR"),
  }



  this.advance = function () {
    this.position++;
    if (this.position > this.text.length - 1)
      this.currentChar = null;
    else
      this.currentChar = this.text[this.position];
  }

  this.id = function () {
    let result = "";
    while (this.currentChar != null && /[a-z]/i.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (result in this.reservedKeywords)
      return this.reservedKeywords[result];
    else {
      if (!this.id_list.includes(result)) this.id_list.push(result);
      return new token("ID", result);
    }
  }

  this.error = function () {
    throw `Неизвестный символ на позиции: ${this.position} ("${this.currentChar}")`
  }

  this.skipSpace = function () {
    while (this.currentChar != null && this.currentChar == " ")
      this.advance();
  }

  this.number = function () {
    let result = "";
    while (this.currentChar != null && !isNaN(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return +result;
  }

  this.peek = function () {
    let peekPos = this.position + 1;
    if (peekPos > this.text.length - 1)
      return null;
    else
      return this.text[peekPos];
  }

  this.getNextToken = function () {

    while (this.currentChar != null) {

      if (this.currentChar == " ")
        this.skipSpace();

      if (!isNaN(this.currentChar)) {
        const number = this.number();
        if (!this.constants_list.includes(number)) this.constants_list.push(number);
        return new token("NUMBER", number);
      }

      if (/[a-z]/i.test(this.currentChar))
        return this.id();

      if (this.currentChar == ":" && this.peek() == "=") {
        this.advance();
        this.advance();
        return new token("ASSIGN", ":=");
      }

      if (this.currentChar == "<" && this.peek() == "=") {
        this.advance();
        this.advance();
        return new token("LE", "<=");
      }

      if (this.currentChar == ">" && this.peek() == "=") {
        this.advance();
        this.advance();
        return new token("GE", ">=");
      }

      if (this.currentChar == "+") {
        this.advance();
        return new token("PLUS", "+");
      }

      if (this.currentChar == "-") {
        this.advance();
        return new token("MINUS", "-");
      }

      if (this.currentChar == "*") {
        this.advance();
        return new token("MUL", "*");
      }

      if (this.currentChar == "/") {
        this.advance();
        return new token("DIV", "/");
      }

      if (this.currentChar == "(") {
        this.advance();
        return new token("LPAREN", "(");
      }

      if (this.currentChar == ")") {
        this.advance();
        return new token("RPAREN", ")");
      }

      if (this.currentChar == "=") {
        this.advance();
        return new token("EQ", "=");
      }

      if (this.currentChar == "<") {
        this.advance();
        return new token("LW", "<");
      }

      if (this.currentChar == ">") {
        this.advance();
        return new token("GR", ">");
      }

      if (this.currentChar == ":") {
        this.advance();
        return new token("COLON", ":");
      }

      if (this.currentChar == ";") {
        this.advance();
        return new token("SEMI", ";");
      }

      if (this.currentChar == ".") {
        this.advance();
        return new token("DOT", ".");
      }

      if (this.currentChar == ",") {
        this.advance();
        return new token("SEP", ",");
      }

      if (this.currentChar == "[") {
        this.advance();
        return new token("SLPAREN", "[");
      }

      if (this.currentChar == "]") {
        this.advance();
        return new token("SRPAREN", "]");
      }

      this.error();
    }
    return new token("EOF", null);
  }
}

const program_text = "PROGRAM spo; \
VAR a, b, c: INTEGER; \
BEGIN \
IF (a = 0) THEN a:= a * a * a; \
IF (a < 0) THEN a: = a * a;\
IF (b < 0) THEN b: = b * b;\
IF (b > 0) THEN b: = b * b * b;\
IF (c > 0) THEN c: = c * c * c;\
IF (c < 0) THEN c: = c * c;\
END. \
"
const lex = new lexer(program_text)

let token_list = []

while (true) {
  token_list.push(lex.getNextToken())
  if (token_list[token_list.length - 1].type === "EOF") break
}
console.log(JSON.stringify(token_list, null, 4))
console.log(lex.id_list, lex.constants_list, lex.reservedKeywords_list, lex.separators_list)