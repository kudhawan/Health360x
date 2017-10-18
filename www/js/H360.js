function toggleBGTabs(tag) {
    $("#lnkTab1").removeClass('active');
    $("#lnkTab2").removeClass('active');
    $("#lnkTab3").removeClass('active');

    $("#tab1").slideUp();
    $("#tab2").slideUp();
    $("#tab3").slideUp();

    $("#lnkTab" + tag).addClass('active');
    $("#tab" + tag).slideDown('active');
    return false;
}

function toggleBPTabs(tag) {
    $("#lnkiTab1").removeClass('active');
    $("#lnkiTab2").removeClass('active');
    $("#lnkiTab3").removeClass('active');

    $("#itab1").slideUp();
    $("#itab2").slideUp();
    $("#itab3").slideUp();

    $("#ilnkTab" + tag).addClass('active');
    $("#itab" + tag).slideDown('active');
    return false;
}

function toggleWTabs(tag) {
    $("#lnkkTab1").removeClass('active');
    $("#lnkkTab2").removeClass('active');
    $("#lnkkTab3").removeClass('active');

    $("#ktab1").slideUp();
    $("#ktab2").slideUp();
    $("#ktab3").slideUp();

    $("#klnkTab" + tag).addClass('active');
    $("#ktab" + tag).slideDown('active');
    return false;
}


function getRotationAngleForBW(bValue) {

    var gAng = 0;

    if (bValue == 0)
        gAng = -124;
    else if (bValue > 0 && bValue <= 25)
        gAng = -132 + bValue;
    else if (bValue > 25 && bValue <= 50)
        gAng = -138 + bValue;
    else if (bValue > 50 && bValue <= 75)
        gAng = -144 + bValue;
    else if (bValue > 75 && bValue <= 100)
        gAng = -149 + bValue;
    else if (bValue > 100 && bValue <= 125)
        gAng = -155 + bValue;
    else if (bValue > 125 && bValue <= 150)
        gAng = -160.5 + bValue;
    else if (bValue > 150 && bValue <= 175)
        gAng = -166 + bValue;
    else if (bValue > 175 && bValue <= 200)
        gAng = -172 + bValue;
    else if (bValue > 200 && bValue <= 225)
        gAng = -178 + bValue;
    else if (bValue > 225 && bValue <= 250)
        gAng = -184 + bValue;
    else if (bValue > 250 && bValue <= 275)
        gAng = -190 + bValue;
    else if (bValue > 275 && bValue <= 300)
        gAng = -196 + bValue;
    else if (bValue > 300 && bValue <= 325)
        gAng = -201 + bValue;
    else if (bValue > 325 && bValue <= 350)
        gAng = -207 + bValue;
    else if (bValue > 350 && bValue <= 375)
        gAng = -213 + bValue;
    else if (bValue > 375 && bValue <= 400)
        gAng = -220 + bValue;

    return gAng;

}

function getRotationAngleForNUT(bValue) {

    var gAng = 0;

    if (bValue == 0)
        gAng = -86;
    else if (bValue > 0 && bValue <= 100)
        gAng = -86 + (bValue / 5.2);
    else if (bValue > 100 && bValue <= 200)
        gAng = -86 + (bValue / 5.3);
    else if (bValue > 200 && bValue <= 300)
        gAng = -86 + (bValue / 5.36);
    else if (bValue > 300 && bValue <= 350)
        gAng = -86 + (bValue / 6.2);
    else if (bValue > 350 && bValue <= 400)
        gAng = -86 + (bValue / 5.28);
    else if (bValue > 400 && bValue <= 450)
        gAng = -86 + (bValue / 4.75);
    else if (bValue > 450 && bValue <= 500)
        gAng = -86 + (bValue / 4.39);
    else if (bValue > 500 && bValue <= 600)
        gAng = -86 + (bValue / 4.50);
    else if (bValue > 600 && bValue <= 700)
        gAng = -86 + (bValue / 4.60);
    else if (bValue > 700 && bValue <= 800)
        gAng = -86 + (bValue / 4.68);
    else if (bValue > 800 && bValue <= 900)
        gAng = -86 + (bValue / 4.74);
    else if (bValue > 900 && bValue <= 1000)
        gAng = -86 + (bValue / 4.79);
    else if (bValue > 1000 && bValue <= 1100)
        gAng = -86 + (bValue / 4.85);
    else if (bValue > 1100 && bValue <= 1200)
        gAng = -86 + (bValue / 4.88);
    
    return gAng;

}


function getRotationAngleForSYSTOLIC_old(bValue) {
    console.log(bValue);

    var gAng = 0;

    if (bValue >= 60 && bValue <= 70)
        gAng = -138 + bValue;
    else if (bValue > 70 && bValue <= 80)
        gAng = -129 + bValue;
    else if (bValue > 80 && bValue <= 90)
        gAng = -120 + bValue;
    else if (bValue > 90 && bValue <= 100)
        gAng = -110 + bValue;
    else if (bValue > 100 && bValue <= 110)
        gAng = -101 + bValue;
    else if (bValue > 110 && bValue <= 115)
        gAng = -87 + bValue;
    else if (bValue > 115 && bValue <= 120)
        gAng = -74 + bValue;
    else if (bValue > 120 && bValue <= 130)
        gAng = -65 + bValue;
    else if (bValue > 130 && bValue <= 140)
        gAng = -55 + bValue;
    else if (bValue > 140 && bValue <= 150)
        gAng = -46 + bValue;
    else if (bValue > 150 && bValue <= 160)
        gAng = -37 + bValue;
    else if (bValue > 160 && bValue <= 170)
        gAng = -29 + bValue;
    else if (bValue > 170 && bValue <= 180)
        gAng = -20 + bValue;

    return gAng;
}
function getRotationAngleForSYSTOLIC(bValue) {
    console.log(bValue);

    var gAng = 0;

    if (bValue >= 0 && bValue <= 40) {
        gAng = -88;
    }
    if (bValue > 40 && bValue <= 60) {
        gAng = -89;
    }
    if (bValue > 60 && bValue <= 80) {
        gAng = -90;
    }
    if (bValue > 80 && bValue <= 100) {
        gAng = -91;
    }
    if (bValue > 100 && bValue <= 120) {
        gAng = -92;
    }
    if (bValue > 120 && bValue <= 140) {
        gAng = -93;
    }
    if (bValue > 140 && bValue <= 160) {
        gAng = -94;
    }
    if (bValue > 160 && bValue <= 180) {
        gAng = -95;
    }
    if (bValue > 180 && bValue <= 200) {
        gAng = -96;
    }
    if (bValue > 200 && bValue <= 220) {
        gAng = -97;
    }
    if (bValue > 220 && bValue <= 240) {
        gAng = -98;
    }
    if (bValue > 240 && bValue <= 260) {
        gAng = -99;
    }

    return gAng;
}


function getRotationAngleForDIASTOLIC(bValue) {

    var gAng = 0;

    if (bValue == 50)
        gAng = -135 + bValue
    else if (bValue > 50 && bValue <= 55)
        gAng = -120 + bValue;
    else if (bValue > 55 && bValue <= 60)
        gAng = -108 + bValue;
    else if (bValue > 60 && bValue <= 65)
        gAng = -95 + bValue;
    else if (bValue > 65 && bValue <= 70)
        gAng = -80 + bValue;
    else if (bValue > 70 && bValue <= 75)
        gAng = -67 + bValue;
    else if (bValue > 75 && bValue <= 80)
        gAng = -53 + bValue;
    else if (bValue > 80 && bValue <= 85)
        gAng = -40 + bValue;
    else if (bValue > 85 && bValue <= 90)
        gAng = -25 + bValue;
    else if (bValue > 90 && bValue <= 95)
        gAng = -11 + bValue;
    else if (bValue > 95 && bValue <= 100)
        gAng = bValue + 20;
    else if (bValue > 100 && bValue <= 105)
        gAng = bValue + 37;
    else if (bValue > 105 && bValue <= 110)
        gAng = bValue + 50;

    return gAng;

}
 
function getRotationAngle(bValue) {

    var gAng = 0;

    if (bValue >= 0 && bValue <= 40) {
        gAng = -88;
    }
    if (bValue > 40 && bValue <= 60) {
        gAng = -89;
    }
    if (bValue > 60 && bValue <= 80) {
        gAng = -90;
    }
    if (bValue > 80 && bValue <= 100) {
        gAng = -91;
    }
    if (bValue > 100 && bValue <= 120) {
        gAng = -92;
    }
    if (bValue > 120 && bValue <= 140) {
        gAng = -93;
    }
    if (bValue > 140 && bValue <= 160) {
        gAng = -94;
    }
    if (bValue > 160 && bValue <= 180) {
        gAng = -95;
    }
    if (bValue > 180 && bValue <= 200) {
        gAng = -96;
    }
    if (bValue > 200 && bValue <= 220) {
        gAng = -97;
    }
    if (bValue > 220 && bValue <= 240) {
        gAng = -98;
    }
    if (bValue > 240 && bValue <= 260) {
        gAng = -99;
    }
    // if (bValue > 100 && bValue <= 105) {
    //     gAng = -85;
    // }
    // if (bValue > 105 && bValue <= 110) {
    //     gAng = -82;
    // }
    // else if (bValue > 110 && bValue <= 140) {
    //     gAng = -82;
    // }

    // else if (bValue > 140 && bValue <= 159) {
    //     gAng = -75;
    // }

    // else if (bValue > 159 && bValue < 180) {
    //     gAng = -75.5;
    // }

    // else if (bValue >= 180 && bValue <= 200) {
    //     gAng = -77;
    // }

    // else if (bValue >= 200 && bValue <= 220) {
    //     gAng = -78;
    // }
    // else if (bValue >= 220 && bValue <= 250) {
    //     gAng = -79;
    // }

    return gAng;
}

function showToast(messsage, alertType) {

    if (alertType.toString().toUpperCase() == 'ERROR') {
        $.iaoAlert({
            msg: messsage,
            type: "error",
            mode: "dark",
        });
    }
    else if (alertType.toString().toUpperCase() == 'WARNING') {
        $.iaoAlert({
            msg: messsage,
            type: "warning",
            mode: "dark",
        });
    }
    else if (alertType.toString().toUpperCase() == 'SUCCESS') {
        $.iaoAlert({
            msg: messsage,
            type: "success",
            mode: "dark",
        });
    }
    else if (alertType.toString().toUpperCase() == 'INFO') {
        $.iaoAlert({
            msg: messsage,
            type: "notification",
            mode: "dark",
        });
    }

}