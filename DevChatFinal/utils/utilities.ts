
export function opformat(listInp){
    let  i = 1
    let op = ''
    for (i;i<listInp.length+1;i++){
        op+=listInp[i-1]
        if (i%3==0){
            op+="\n"
        }
        else{
            op+="  "
        }
    }
    return op
}

