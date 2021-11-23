function token(initType, initValue) {
  this.type = initType;
  this.value = initValue;

  this.stringRep = function () {
    return "TOKEN(" + this.type + ", " + this.value + ")";
  }
}

function lexer(initText) {
  this.text = initText;
  this.position = 0;
  this.currentChar = this.text[this.position];

  this.reservedKeywords = {
    BEGIN: new token("BEGIN", "BEGIN"),
    END: new token("END", "END"),
    PROGRAM: new token("PROGRAM", "PROGRAM")
  }

  this.id = function () {
    var result = "";
    while (this.currentChar != null && /[a-z]/i.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (result in this.reservedKeywords)
      return this.reservedKeywords[result];
    else
      return new token("ID", result);
  }

  this.error = function () {
    throw "Invalid character"
  }

  this.advance = function () {
    this.position++;
    if (this.position > this.text.length - 1)
      this.currentChar = null;
    else
      this.currentChar = this.text[this.position];
  }

  this.skipWhiteSpace = function () {
    while (this.currentChar != null && this.currentChar == " ")
      this.advance();
  }

  this.integer = function () {
    var result = "";
    while (this.currentChar != null && !isNaN(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return parseInt(result);
  }

  this.peek = function () {
    var peekPos = this.position + 1;
    if (peekPos > this.text.length - 1)
      return null;
    else
      return this.text[peekPos];
  }

  this.getNextToken = function () {

    while (this.currentChar != null) {

      if (this.currentChar == " ")
        this.skipWhiteSpace();

      if (!isNaN(this.currentChar))
        return new token("INTEGER", this.integer());

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

      if (/[a-z]/i.test(this.currentChar))
        return this.id();

      if (this.currentChar == ":" && this.peek() == "=") {
        this.advance();
        this.advance();
        return new token("ASSIGN", ":=");
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

      this.error();
    }
    return new token("EOF", null);
  }
}

const program_text = "PROGRAM PRIMER; VAR x, y, z"
const lex = new lexer(program_text)

let token_list = []

while (true) {
  token_list.push(lex.getNextToken())
  if (token_list[token_list.length - 1].type === "EOF") break
}

console.log(token_list)