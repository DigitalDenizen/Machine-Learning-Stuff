/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

var bool = false;
var counter = 0;
var prevSI;
var EV = [];
var threatList = [];
var EC = [];
var linksSecured = [];
var priorityNodes = [];
var priorities = [];//Use array to check against already prioritized node links

//Node/Gateway lists
var nodeLinks = [];
var EIL = [];
var gateLinksList = [];
var attackNodes = [];

for (var i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    var N2 = parseInt(inputs[1]);
    nodeLinks.push({n1: N1, n2: N2});
}
for (var i = 0; i < E; i++) {
    var EI = parseInt(readline()); // the index of a gateway node
    EIL.push(EI);
}
for(var i = 0; i < nodeLinks.lenth; i++) { // build list of gateway links
    if(nodelinks[i].n1 === EIL[i]){
        gateLinksList.push({Gate: EIL[i], node: nodelinks[i].n2});
    } else if(nodelinks[i].n2 === EIL[i]){
        gateLinksList.push({node: nodelinks[i].n1, Gate: EIL[i]});
    }
}

// game loop
while (true) {
    var command;
    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn

    var nodeLinkAtRisk = findAtRiskNode(SI);
    
    EC = [];
    for(var i = 0; i < EIL.length; i++){ //For loop checks for immediate threats.
        var EL = EIL[i];
        for(var j = 0; j < n1L.length; j++){
            var n1 = nodelinks[j].n1;
            var n2 = nodelinks[j].n2;
            if((n1 === SI && n2 === EL) || (n1 === EL && n2 === SI)){
                EC.push({Gate: EL, node: SI})
                bool = true;
            }
        }
    }
    // Write an action using print()
    // To debug: printErr('Debug messages...');
    printErr(bool);
    if(bool) {
        makeLinkSecure(EC);
        bool = false;
    }
    else {
        makeLinkSecure(nodeLinkAtRisk); //Function that secures designated link after checking
    }
}

function noRepeat(possibleAttacks) {
       for(var i = 0; i < possibleAttacks.length; i++) {
            var string = possibleAttacks[i].node + ' ' + possibleAttacks[i].Gate;
            for(var j = 0; j < linksSecured.length; j++) {
                printErr('Good: ' + linksSecured[j]);
                printErr('Check: ' + string);
                if(string === linksSecured[j]){
                    possibleAttacks.splice(i, 1);
                    i = -1;
                }
            }
       }
       return possibleAttacks;
}

function makeLinkSecure(newList) {
    var unsecuredLinks = noRepeat(newList);
    for(var i = 0; i < unsecuredLinks.length; i++) {
        printErr('Secured Link: ' + unsecuredLinks[i].node + ' ' + unsecuredLinks[i].Gate);
        print(unsecuredLinks[i].node + ' ' + unsecuredLinks[i].Gate);
        linksSecured.push({n1: unsecuredLinks[i].node, n2: unsecuredLinks[i].Gate});
        return;
    }
}

function isSecure(link) {
    var bool = false;
    for(var i = 0; i < linksSecured.length; i++){
        if((link.n1 === linksSecured[i].n1 && link.n2 === linksSecured[i].n2) ||
        (link.n1 === linksSecured[i].n1 && link.n2 === linksSecured[i].n2)){
            bool = true;
        }
    }
    return bool;
}

function isLinkToGateway(link) { // Looks in gateLinksList to see if matches content
    var isLinkGate = false;
    for(var i = 0; i < gateLinksList.length; i++){
        n1 = gateLinksList[i].node;
        Gate = gateLinksList[i].Gate;
        if((n1 === link.n1 && Gate === link.n2) || (n1 === link.n2 && Gate === link.n1)){
            isLinkGate === true;
        }
    }
    return isLinkGate;
}

function findAtRiskNode(SI){ //Uses priorities and nodeLinks array;
    var priorityNotFound = true;
    var highestPriority = {
    
    }
    var nextNode ={ 
        n1: undefined,
        n2: SI, //SI is set to value of nextNode.n2
        linksAwayFromSi: undefined
    } 
    var linksAway = 0;
    while(priorityNotFound){
        for(var i = 0; i < nodeLinks.length; i++) {
            linksAway++;
            var newLink = nodeLinks[i];
            
            if(nextNode.n2 === newLink.n1) {    
                if(isLinkToGateway(newLink) && !hasLinkedBeenChecked(newLink) && isSecure(newLink)){
                    var isBranch = isGateBranch(newLink);
                    if((nextNode.linksAwayFromSi < highestPriority.linksAwayFromSi || highestPriority.linksAwayFromSi === undefined) && isBranch){
                        highestPriority = {
                            n1: newLink.n1,
                            n2: newLink.n2,
                            linksAwayFromSi: linksAway
                        }
                        priorityNotFound = false;
                        priorities.push(newLink);
                    } else if (!isBranch){
                        linksAway--;
                        priorities.push(newLink);
                    } else {
                        nextNode.n1 = newLink.n1;
                        nextNode.n2 = newLink.n2;
                        nextNode.linksAwayFromSi = linksAway;
                    }
                }
            }
        }
    }

    return highestPriority;
}

function isGateBranch(link) {
    var isGateReallllyABranch = false;
    for(var i = 0; i < gateLinksList.length; i++) {
        gate = gateLinksList.Gate;
        node = gateLinksList.node;

        if ((link.n1 !== gate && link.n2 !== gate) && (link.n1 === node || link.n2 === node)){
            isGateReallllyABranch = true;
        }
    }
    printErr('IsGateBranch Works!');
    return isGateReallllyABranch;
}

function hasLinkBeenChecked(link) {
    var linkHasBeenChecked = false;
    for(var i = 0; i < priorities.length; i++) {
        n1 = nodeLink[i].n1;
        n2 = nodeLink[i].n2;

        if((n1 === link.n1 && n2 === link.n2) || (n1 === link.n2 && n2 === link.n1)){
            linkHasBeenChecked = true;
        }
    }
    printErr('hasLinkBeenChecked Works!');
    return linkHasBeenChecked;
}