 //box = [L,W,H]
 const boxlist = [
    [6,6,6],
    [8,8,8],
    [12,12,12],
    [14,14,14],
    [16,16,16],
    [18,18,18],
    [20,20,20],
    [24,24,24],
    [9,6,4],
    [10,8,6],
    [12,9,3],
    [12,9,9],
    [12,10,6],
    [12,12,6],
    [14,10,8],
    [15,12,10],
    [16,16,4],
    [17,11,8],
    [18,12,12],
    [18,14,10],
    [18,18,6],
    [20,12,12],
    [24,12,12],
    [24,16,16],
    [20,15,15],
    [24,18,16],
    [30,24,12],
    [30,24,6]
];

const boxForm = document.getElementById("boxForm");
const resetButton = document.getElementById("resetButton");
const output = document.getElementById("output"); 
const inputlength = document.getElementById("length");
const inputwidth = document.getElementById("width");
const inputheight = document.getElementById("height");

const choices = 2;
const alwaysNoResize = true;

var maxScore = 0;

boxForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let dimArray = [Number(inputlength.value),Number(inputwidth.value),Number(inputheight.value)];
    dimArray.sort(function(a, b) {return a - b;});

    const height = dimArray[0];
    const width = dimArray[1];
    const length = dimArray[2];

    let boxes = getBoxes(length,width,height);

    output.innerHTML = "";
    let nonResized = false;
    let i = 0
    for(i = 0;i<choices;i++)
    {
        if(boxes[i].score < 999) output.appendChild(generateOutput(boxes[i]));
        
        if(!boxes[i].resize) nonResized=true;
    }

    while(!nonResized || i > boxes.length)
    {
        if(!boxes[i].resize){
            output.appendChild(generateOutput(boxes[i]));
            nonResized=true;
        }
        i++
    }
});

resetButton.addEventListener("click", (e) => { clear(); });

function clear()
{
    output.innerHTML="";
    inputlength.value = "";
    inputwidth.value = "";
    inputheight.value = "";
}

function getBoxes(length,width,height)
{
    const girth = length + width;

    let boxes = [];
    for(let i = 0; i < boxlist.length; i++)
    {
        let box = boxlist[i];

        let boxScore = getScore(length,width,height,box);
        boxes.push(boxScore);
    }

    boxes.sort(function(a, b) {return a.score - b.score;});

    return boxes;
}

function getScore(length,width,height,box)
{
    const girth = length+width;
    const boxLength = box[0];
    const boxWidth = box[1];
    const boxHeight = box[2];
    const boxGirth = boxLength + boxWidth;
    const noScore = {score:999,box: null, newSize: null, resize: false};
    
    maxScore = 0;

    if (boxHeight < height) return noScore;

    if (boxGirth < girth) return noScore;

    let score = 999;
    if (boxLength >= length && boxWidth >= width)
    {
        
        //no resize necessary
        if(boxHeight == height)
        {
            //no cutting either
            score = calcScore(length,boxLength,width,boxWidth,height,boxHeight);//(boxLength-length) + (boxWidth-width)+ (boxHeight-height)  + (boxLength-boxWidth) + (boxLength-length);
            maxScore += score;
            return {score:score,box:box,newSize:box, resize: false};
        }
        else
        {
            //cut down box to height
            score = calcScore(length,boxLength,width,boxWidth,height,height);//(boxLength-length) + (boxWidth-width)+ (boxHeight-height)  + (boxLength-boxWidth) + (boxLength-length);
            maxScore+=score;
            return {score:score,box:box,newSize:[boxLength,boxWidth,height], resize: false};
        }
        
    }

    let newSize = null;
    for(let i = 2; i < boxGirth; i++)
    {
        let newLength = Math.max(i,boxGirth-i);
        let newWidth = boxGirth - newLength;

        if ((Math.abs(newLength - boxLength) >= 2) && (Math.abs(newWidth - boxWidth) >= 2)) //avoid changing a box by less than 2 inches
        {
            if(newLength >= length && newWidth >= width) //box meets new criteria
            {
                let tempScore = calcScore(length,newLength,width,newWidth,height,height);
                maxScore+=tempScore;

                if (tempScore < score)
                {
                 score = tempScore;
                 newSize = [newLength,newWidth,height];   
                }
            }
        }
    }

    return {score:score,box:box,newSize:newSize,resize:true};
}

function calcScore(length,boxLength,width,boxWidth,height,boxHeight)
{
    return ((boxLength-length) + (boxWidth-width) + (boxHeight-height));
}

function generateOutput(box)
{
    var boxChoice = document.createElement('div');
    boxChoice.classList.add("box-choice");

    var boxSize = document.createElement('h3');
    var boxText = document.createTextNode(box.box);
    boxSize.appendChild(boxText);
    boxChoice.appendChild(boxSize);

    var score = document.createElement('h3');
    score.classList.add("score");
    var scoreText = document.createTextNode(scorePercentile(box.score));
    score.appendChild(scoreText);
    boxChoice.appendChild(score);
    
    var details = document.createElement('div');
    details.classList.add("details");

    if(box.box[0] != box.newSize[0] || box.box[1] != box.newSize[1])
    {
        //Box resized
        var resize = document.createElement('div');
        var resizeText = document.createTextNode("Resize to " + box.newSize[0] +"x"+box.newSize[1]);
        resize.appendChild(resizeText);
        details.appendChild(resize);
    }
    if(box.box[2] != box.newSize[2])
    {
        //box cut down
        var cut = document.createElement('div');
        var cutText = document.createTextNode("Cut down to " + box.newSize[2]);
        cut.appendChild(cutText);
        details.appendChild(cut);
    }
    boxChoice.appendChild(details);
    

    return boxChoice;
}

function scorePercentile(score)
{
    if(maxScore==0) return "100%"
    return Math.trunc(100 * (1 - (score / maxScore))) + "%"
}

clear();