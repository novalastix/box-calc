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

boxForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const output = document.getElementById("output"); 
    const inputlength = Number(document.getElementById("length").value);
    const inputwidth = Number(document.getElementById("width").value);
    const inputheight = Number(document.getElementById("height").value);
    
    let dimArray = [inputlength,inputwidth,inputheight];
    dimArray.sort(function(a, b) {return a - b;});

    const height = dimArray[0];
    const width = dimArray[1];
    const length = dimArray[2];

    let text = document.createTextNode(getBox(length,width,height));

    output.innerHTML = "";
    output.appendChild(text);
});

function getBox(length,width,height){
    const girth = length + width;

    // let score = 999;
    // let bestBox = null;

    let boxScores = []
    for(let i = 0; i < boxlist.length; i++)
    {
        let box = boxlist[i];
        // let boxLength = box[0];
        // let boxWidth = box[1];
        // let boxHeight = box[2];
        // let boxGirth = boxLength + boxWidth;

        // console.log(score);
        // console.log(bestBox);

        // console.log(boxHeight)
        // if (boxHeight >= height)
        // {
        //     console.log(boxGirth)
        //     if(boxGirth >= girth)
        //     {
        //         let boxScore = boxGirth - girth;

        //         console.log("box score: " + boxScore);

        //         if(score > boxScore)
        //         {
        //             score = boxScore;
        //             bestBox = i;
        //         }
        //     }
        // }

        let boxScore = getScore(length,width,height,box);
        console.log(boxScore.box)
        console.log(boxScore.score)

        boxScores.push(boxScore);

        // if(score > boxScore.score)
        // {
        //     score = boxScore.score;
        //     bestBox = boxScore;
        // }
    }

    boxScores.sort(function(a, b) {return a.score - b.score;});

    let output = "";
    for(let i = 0;i<3;i++)
    {
        if(boxScores[i].score < 999) output+="["+ boxScores[i].box +"] resized to ["+ boxScores[i].newSize +"] (SCORE: "+ boxScores[i].score +") <br/>"
    }

   return output

    // if (bestBox.resize) return "box: ["+ bestBox.box +"] resized to ["+bestBox.newSize+"] (SCORE: "+ bestBox.score+")";
    // else return "box: ["+ bestBox.box +"] (SCORE: "+ bestBox.score+")";
}

// getScore(length,width,height,box)
// {
//     let boxLength = box[0];
//     let boxWidth = box[1];
//     let boxHeight = box[2];
//     let boxGirth = boxLength + boxWidth;
//     let girth = length+width;

//     if(height > boxHeight) return 999;

//     if (girth > boxGirth) return 999;

//     if((boxGirth - girth)  )
// }

// function getResize(length,width,boxLength,boxWidth)
// {
//     let lengthDif = boxLength-length;
//     let boxGirth = boxLength+boxWidth;

//     for (let diff = 2; diff < (boxWidth-1); diff++)
//     {
//         let newWidth = boxWidth-diff;
//         let newLength = boxLength+diff;

//         if(newLength >= length && newWidth >= width)
//         {
//             return [newLength,newWidth];   
//         }
//     }
// }

function getScore(length,width,height,box)
{
    const girth = length+width;
    const boxLength = box[0];
    const boxWidth = box[1];
    const boxHeight = box[2];
    const boxGirth = boxLength + boxWidth;
    const noScore = {score:999,box: null, newSize: null, resize: false};

    if (boxHeight < height) return noScore;

    if (boxGirth < girth) return noScore;

    if (boxLength >= length && boxWidth >= width)
    {
        //no changes necessary
        let score = calcScore(length,boxLength,width,boxWidth,height,boxHeight);//(boxLength-length) + (boxWidth-width)+ (boxHeight-height)  + (boxLength-boxWidth) + (boxLength-length);

        return {score:score,box:box,newSize:box, resize: false};
    }

    let score = 999;
    let newSize = null;
    for(let i = 2; i < boxGirth; i++)
    {
        let newLength = Math.max(i,boxGirth-i);
        let newWidth = boxGirth - newLength;

        if ((Math.abs(newLength - boxLength) >= 2) && (Math.abs(newWidth - boxWidth) >= 2)) //avoid changing a box by less than 2 inches
        {
            if(newLength >= length && newWidth >= width) //box meets new criteria
            {
                let tempScore = calcScore(length,newLength,width,newWidth,height,boxHeight);
                if (tempScore < score)
                {
                 score = tempScore;
                 newSize = [newLength,newWidth,boxHeight];   
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