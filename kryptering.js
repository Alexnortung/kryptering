var c;
var alphabet = "abcdefghijklmnopqrstuvwxyzæøå";
var forskydning = 0;
var key = alphabet;

var ceasarObject;


function setup() {
	$('input[type="range"]').rangeslider().on("input", function(){
		var val = ceasarObject.rangeSliderJQ[0].value;
		ceasarObject.forskydning = val;
		ceasarObject.changeForskydning(val);
		ceasarObject.output();
	});


	c = createCanvas(350,350);
	jQuery("#" + c.canvas.id).detach().appendTo('#canvasDiv');
	ceasarObject = new Ceasar(
		$("#input")[0], 
		$("#forskydning")[0], 
		$("#output")[0], 
		$("#key")[0], 
		$("#method")[0], 
		$("#startLetters")[0],
		$("#rangesliderforskydning")
	);

}

function draw() {
	//line(0,0,width, height);
	ceasarObject.draw();	
}


function Ceasar(inputField, forskydningField, outputField, keyField, methodField, startLettersField, rangeSliderJQ){
	this.forskydning = 0;
	this.alphabet = alphabet;
	this.key = alphabet;
	this.inputField = inputField;
	this.outputField = outputField;
	this.forskydningField = forskydningField;
	this.keyField = keyField;
	this.methodField = methodField;
	this.startLettersField = startLettersField
	this.rangeSliderJQ = rangeSliderJQ;
	this.method = 0;
	this.startLetters = "";

	var thisInst = this;

	this.inputField.onchange =  function() {
		//console.log("input changed");
		thisInst.output();
	};

	this.forskydningField.value = this.forskydning;
	this.forskydningField.onchange = function() {
		thisInst.changeForskydning(thisInst.forskydningField.value);
		thisInst.output();
	}
/**
	this.forskydningField.onmove = function() {
		thisInst.changeForskydning(thisInst.forskydningField.value);
		thisInst.output();
	}
**/

	this.keyField.value = this.key;
	this.keyField.onchange = function () {
		thisInst.changeKey(thisInst.keyField.value);
		thisInst.output();
	}

	this.methodField.onchange = function() {
		thisInst.method = thisInst.methodField.value;
		thisInst.output();
	}

	this.startLettersField.onchange = function () {
		//console.log(thisInst.startLettersField.value)
		thisInst.SpecialStartKey( thisInst.startLettersField.value );
		thisInst.output();
	}

	this.rangeSliderJQ[0].value = this.forskydning;
	this.rangeSliderJQ[0].onchange = function () {
		thisInst.forskydning = thisInst.rangeSliderJQ[0].value;
		thisInst.changeForskydning(thisInst.rangeSliderJQ[0].value);
		thisInst.output();
	}


}

Ceasar.prototype.encrypt = function () {
	var toEncrypt = this.inputField.value;
	var output = "";
	for (var i = 0; i < toEncrypt.length; i++) {
		var character = toEncrypt.charAt(i);
		var index = this.alphabet.indexOf(character.toLowerCase());
		if (index != -1) {
			var keyChar = this.key.charAt(index);
			if (character == character.toUpperCase()) {
				output += keyChar.toUpperCase();
			} else {
				output += keyChar;
			}
		} else if (toEncrypt.charAt(i) == " ") {
			output += " ";
		}

		else {
			output += "*"
		}
		
	}

	return output;
}

Ceasar.prototype.decrypt = function () {
	var toEncrypt = this.inputField.value;
	var output = "";
	for (var i = 0; i < toEncrypt.length; i++) {
		var character = toEncrypt.charAt(i);
		var index = this.key.indexOf(character.toLowerCase());
		if (index != -1) {
			var keyChar = this.alphabet.charAt(index);
			if (character == character.toUpperCase()) {
				output += keyChar.toUpperCase();
			} else {
				output += keyChar;
			}
		} else if (toEncrypt.charAt(i) == " ") {
			output += " ";
		}

		else {
			output += "*"
		}
		
	}

	return output;
}

Ceasar.prototype.changeForskydning = function (nyForskydning) {
	nyForskydning = parseInt(nyForskydning);
	this.forskydning = nyForskydning;

	this.SpecialStartKey(this.startLettersField.value);
	this.output();

	this.keyField.value = this.key;
	this.rangeSliderJQ[0].value = this.forskydning;
}

Ceasar.prototype.getForskydningsAlphabet = function() {
	outputAlphabet = "";
	if (this.forskydning >= 0) {
		outputAlphabet += this.alphabet.substring(this.forskydning, this.alphabet.length);
		outputAlphabet += this.alphabet.substring(0,this.forskydning);
	} else {

		var startPart = this.alphabet.substring(this.alphabet.length + this.forskydning, this.alphabet.length);
		var endPart = this.alphabet.substring(0, this.alphabet.length + this.forskydning);
		outputAlphabet += startPart;
		outputAlphabet += endPart;
		
	}

	return outputAlphabet;
}

Ceasar.prototype.changeKey = function (nyKey) {
	this.key = nyKey;
	this.output();
}

Ceasar.prototype.SpecialStartKey = function (startLetters) {
	startLetters = startLetters.toLowerCase();
	//console.log(startLetters);
	var prependChars = "";
	var tempAlphabet = this.getForskydningsAlphabet();

	//console.log(tempAlphabet);

	for (var i = 0; i < startLetters.length; i++) {
		//console.log(startLetters[i]);
		if(prependChars.indexOf(startLetters[i]) == -1 && this.alphabet.indexOf(startLetters[i]) != -1) {
			prependChars += startLetters[i];
			var temp1 = tempAlphabet.slice(0, tempAlphabet.indexOf(startLetters[i]));
			var temp2 = tempAlphabet.slice(tempAlphabet.indexOf(startLetters[i]) +1, tempAlphabet.length);
			tempAlphabet = temp1 + temp2;
		}
	}

	//console.log(prependChars, tempAlphabet);

	this.key = prependChars + tempAlphabet;

}

Ceasar.prototype.output = function () {
	this.updateFields();
	var outputString = "";
	if (this.method == 0) {
		var encrypted = this.encrypt();
		outputString += encrypted;


	} else if (this.method == 1){
		var decrypted = this.decrypt();
		outputString += decrypted;

	}
	//console.log(outputString);

	this.outputField.value = outputString;
}

Ceasar.prototype.updateFields = function() {

	this.forskydningField.value = this.forskydning;
	this.keyField.value = this.key;


}

Ceasar.prototype.draw = function() {
	var fontSize = 16;
	var cr = height * 0.9;
	var cr2 = cr - fontSize * 3.5;

	ellipse(width/2 , height/2, cr);
	ellipse(width/2 , height/2, cr2);

	var radPerLetter = 360  * 0.0174532925 / this.alphabet.length;

	for (var i = 0; i < this.alphabet.length; i++) {

		text( this.alphabet[i].toUpperCase(), width/2 + cr * 0.9/2 * sin(i * radPerLetter) - fontSize/3, height/2 + cr*0.9/2 * cos(i * radPerLetter + PI) + fontSize/3);
		text( this.key[i].toUpperCase(), width/2 + cr2 * 0.9/2 * sin(i * radPerLetter) - fontSize/3, height/2 + cr2*0.9/2 * cos(i * radPerLetter + PI) + fontSize/3);

		
	}

	textSize(fontSize);

	

}

Ceasar.prototype.animate = function() {

}

