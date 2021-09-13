currentPage = ".home-page";
previusPage = null;
oyuncular = []
araclar = []
tutanaklar = []

let pagesRow = {
    tutanak: 6,
    arama: 2,
    arananlar: 2
}
let pages = {
    tutanak: 0,
    arananlar: 0,
    arama: 0,
}

$(document).on('keydown', function() {
    switch (event.keyCode) {
        case 27: // ESC
            $.post('http://sand-mdt/closeMDT', JSON.stringify())
        break;
    }
});
$(document).ready(function(){

    window.addEventListener('message', function(event){

        switch (event.data.action) {
            case "displayMDT":
            if ($(".mdt-container").css("display") == "none") {
                $('.mdt-container').show();

            } else {
                $('.mdt-container').hide();
            }
            break;
            case "mdtData":
                event.data.bilgiler.forEach(bum => {
                    tutanaklar = bum.tutanaklar,
                    araclar = bum.araclar,
                    oyuncular = bum.oyuncular
                })

                $(".tutanakCount").find("div > span:first-child").each(function() {
                    $(this).html(tutanaklar.length)
                })
                $("#arananlar").find("div > span:first-child").html(oyuncular.filter(oyuncu => oyuncu.araniyor == 3).length)
                break;
            case "updateData":
                event.data.bilgiler.forEach(bum => {
                    tutanaklar = bum.tutanaklar,
                    araclar = bum.araclar,
                    oyuncular = bum.oyuncular
                })

                switch (event.data.type) {
                    case "tutanaklar": 
                        tutanaklariAyarla()
                        $("#tutanaklar").find("div > span:first-child").html(tutanaklar.length)
                        break;
                    case "arananlar":
                        $("#arananlar").find("div > span:first-child").html(oyuncular.filter(oyuncu => oyuncu.araniyor == 3).length)
                        break;
                }

                break;
        }

    });
});



function sayfaDegistir(sayfa) {
    $(currentPage).hide();
    $(sayfa).show();
    currentPage = sayfa
}

$("#anasayfa").click(function() {
    sayfaDegistir(".home-page")
})

$("#arananlar").click(function() {
    sayfaDegistir(".arananlar")   
})

$("#cezalar").click(function() {
    sayfaDegistir(".cezalar")
})

$("#tutanaklar").click(function() {
    $(".tutanak-home-page").show();
    sayfaDegistir(".tutanaklar")


    $(".tutanak-home-page").show();
    sayfaDegistir(".tutanaklar")
    tutanaklariAyarla()
})

$(".tutanak-olustur-btn").click(function()  {
    $(".tutanak-home-page").hide();
    $(".tutanak-olustur").show();

    previusPage = ".tutanak-home-page"
    currentPage = ".tutanak-olustur"
    addReportPage()
})

$(".tutanak").click(function() {
    $(".tutanak-home-page").hide();
    $(".tutanak-detaylar").show();

    previusPage = ".tutanak-home-page"

})


$(".tutanak-olustur-close").click(function() {
    $($(this).attr("data")).hide();
    $(previusPage).show();
    currentPage = previusPage
})

//add Criminals

$("#criminalsAdd").click(function () {
    addCriminals($("select#criminalsInput").children("option:selected").val())
});



function addCriminals(criminal) {
    let div = $('<div/>', {
        'class':'added-tutanak addet-tutanak-criminals',
        'html':
            `
                <i class="far fa-times-circle"></i>
                <span>${criminal}</span>
            `
    }).appendTo('#criminalsPage');

    $(div).find("i").click(function() {
        this.parentNode.remove()
    })
}

// add Police

$("#copsAdd").click(function () {
    addCops($("select#copsInput").children("option:selected").val())
});

function addCops(cops) {
    let div = $('<div/>', {
        'class':'added-tutanak addet-tutanak-cops',
        'html':`
                <i class="far fa-times-circle"></i>
                <span>${cops}</span>
            `
    }).appendTo('#copsPage');

    $(div).find("i").click(function() {
        this.parentNode.remove()
    })
}

// Search
$("#serach-input").keydown(function(key) {
    if (key.which == 13) {
        if (this.value == null || this.value == undefined || this.value == "") { return }

        $(currentPage).hide();
        $(".search-page-elements").empty();
        $(".serach-page").fadeIn();
        currentPage = ".serach-page";


        setupSearchElements()

        araclar.filter(cars => cars.plate.toLowerCase().includes(this.value)).forEach(arac => {
            let owner = oyuncular.filter(player => player.identifier == arac.owner)
            console.log(owner)
            let div = $('<div/>', {
                'class':'searched-plate',
                'html':`
                    <i class="fas fa-car"></i>
                    <div class="searched-plate-info">
                        <div>
                            <span>Plaka</span>
                            <span>${arac.plate}</span>
                        </div>
                        <div>
                            <span>Aracın Sahibi</span>
                            <span>${owner[0].firstname} ${owner[0].lastname}</span>
                        </div>
                        <div>
                            <span>Garaj</span>
                            <span>${arac.garage}</span>
                        </div>
                    </div>
                    `
            }).appendTo('.search-page-elements');

            $(div).click(function() {
               oyuncular.filter(player => player.identifier.includes(arac.owner)).forEach(data => {
                openPlayerPage(data)
               })
            })

        })
    }
})

function setupSearchElements() {

    let value = $("#serach-input").val()
    let pageCount = Math.ceil(tutanaklar.length / pagesRow.arama)
    let pageInt = pagesRow.arama * pages.arama
    let supreme = oyuncular.filter(players =>  players.firstname.toLowerCase().includes(value) ||  players.lastname.toLowerCase().includes(value) )

    $("div.ileri-geri-buttons").find("span > p:last-child").html(pageCount)
    $("div.ileri-geri-buttons").find("span > p:first-child").html(pages.arama)

    $(".search-page-elements").empty()
    for (let i = pageInt; i < pagesRow.arama + pageInt; i++) {
        let data = supreme[i]

        let img
        if (data.mdt_img == null || data.mdt_img == undefined || data.mdt_img == "") {
            img = "https://cdn.discordapp.com/attachments/833463851550769222/833547585590788136/blank-profile-picture-973460_1280.png"
        } else {
            img = data.mdt_img
    
        }
    
        let div = $('<div/>', {
            'class':'searched-player',
            'html':`
                <img src="${img}">
                <p>${data.firstname} ${data.lastname}</p>
                <div class="searched-player-details">
                    <div class="searched-player-info">
                        <div>
                            <span>Meslek</span>
                            <span>${data.job}</span>
                        </div>
                        <div>
                            <span>Kimlik Numarası</span>
                            <span>#${data.id}</span>
                        </div>
                        <div>
                            <span>Banka Bakiyesi</span>
                            <span>$ ${data.bank}</span>
                        </div>
                        <div>
                            <span>Cinsiyet</span>
                            <span>${setupPlayerSex(data.sex)}</span>
                        </div>
                        <div>
                            <span>Doğum Tarihi</span>
                            <span>${data.dateofbirth}</span>
                        </div>
                        <div>
                            <span>Telefon Numarası</span>
                            <span>${data.phone}</span>
                        </div>
                    </div>
                </div>
                `
        }).appendTo('.search-page-elements');
    
        $(div).click(function() {
            openPlayerPage(data)
        })

        
    }



}

function openPlayerPage(player) {
    $(currentPage).hide();
    $(".user-profile").fadeIn();
    currentPage = ".user-profile"
    $('#player-photo').attr('player-id', player.id);


    //searched-player-info
    $("#player-name").html(`${player.firstname} ${player.lastname}`)
    $("#player-cid").html(`#${player.id}`)
    $("#player-job").html(player.job)
    $("#player-id").html(`#${player.id}`)
    $("#player-bank").html(`$ ${player.bank}`)
    $("#player-sex").html(player.sex)
    $("#player-dob").html(setupPlayerSex(player.sex))
    $("#player-phone").html(player.phone)
    if (player.mdt_img != null || player.mdt_img != undefined || player.mdt_img != "") {
        $('#player-photo').attr('src', player.mdt_img);
    }


    $(".aramakaydı-olustur-btn").attr("player-id", player.id)
    setAraniyor(player.araniyor)



    //setup tutanaklar
    $(".user-profile-middle-tutanaklar").empty()
    tutanaklar.filter(tutanak => 
        tutanak.suclular.includes(player.identifier) || tutanak.polisler.includes(player.identifier)
    ).forEach(data => {
        let div = $('<div/>', {
            'class':'tutanak',
            'html':`
                <div class="tutanak-header">
                    <span>${data.id}. Tutanak</span>
                    <div class="tutanak-members">
                        <div>${data.polisler.length} Polis</div>
                        <div>${data.suclular.length} Suclu</div>
                    </div>
                </div>

                <div class="tutanak-middle">
                    <span>${data.description}</span>
                </div>
                <div class="tutanak-header"></div>
            `
        }).appendTo('.user-profile-middle-tutanaklar');

        $(div).click(function() {
            previusPage = ".user-profile"
            setupTutanaklar(data)
        })
    })
    
    //setup araçlar
    $(".user-profile-bottom").empty()
    araclar.filter(arac =>
        arac.owner.includes(player.identifier) 
    ).forEach(data => {
        $('<div/>', {
            'class':'searched-plate',
            'html':`
                <i class="fas fa-car"></i>
                <div class="searched-plate-info">
                    <div>
                        <span>Plaka</span>
                        <span>${data.plate}</span>
                    </div>
                    <div>
                        <span>Garaj</span>
                        <span>${data.garage}</span>
                    </div>
                </div>
                `
        }).appendTo('.user-profile-bottom');
    })
}


function setAraniyor(int) {
    switch (int) {
        case 1: 
            $("#araniyor").find("i").css("color", "var(--ceza1)");
            $("#araniyor").find("span").html("Temiz");
            $(".aramakaydı-olustur-btn").find("span").html("Arama Kaydı Oluştur");
            $(".aramakaydı-olustur-btn").attr("araniyor", 1)
            break;
        case 2:
            $("#araniyor").find("i").css("color", "var(--sari)");
            $("#araniyor").find("span").html("Hükümlü");
            $(".aramakaydı-olustur-btn").find("span").html("Hükümü Kaldır");
            $(".aramakaydı-olustur-btn").attr("araniyor", 2)
            break;
        case 3: 
            $("#araniyor").find("i").css("color", "var(--ceza3)");
            $("#araniyor").find("span").html("Aranıyor");
            $(".aramakaydı-olustur-btn").find("span").html("Arama Kaydını Kaldır");
            $(".aramakaydı-olustur-btn").attr("araniyor", 3)
            break;
    }
}

$(".aramakaydı-olustur-btn").click(function() {
    let araniyorIndex;

    switch (parseInt($(".aramakaydı-olustur-btn").attr("araniyor"))) {
        case 1:
            araniyorIndex = 3
            break;
        case 2: 
            araniyorIndex = 1
            break;
        case 3: 
            araniyorIndex = 2
            break;
    }

    $.post('http://sand-mdt/setAraniyor', JSON.stringify({ 
        playerid: $(".aramakaydı-olustur-btn").attr("player-id"), 
        araniyorid: araniyorIndex, 
    }))
    setAraniyor(araniyorIndex)
})

function setupPlayerSex(sex) {
    return sex == "m".toLowerCase() ? "Erkek" : "Kadın";
}


function setupTutanaklar(data) {
    $(currentPage).hide();
    $(".tutanaklar").show();
    $(".tutanak-home-page").hide();
    $(".tutanak-detaylar").show();
    currentPage = ".tutanak-detaylar"

    $("#tutanak-info-text").html(`Tutanak ${data.id} detayları aşağıdadır. Suçlular tutanak oluşturulduktan sonra düzenlenemez`)
    $("#tutanak-numara").html(data.id);
    $("#tutanak-detay-rapor-aciklama").html(data.description);


    $("#deleteButton").attr("tutanak-id", data.id)

    console.log(data)

    $(".copsPage").empty()
    data.polisler.forEach(polis => {
        oyuncular.filter(players => players.identifier.includes(polis)).forEach(data => {
            let div = $('<div/>', {
                'class':'added-tutanak',
                'html':`
                    <i class="far fa-times-circle" diabled></i>
                    <span>${data.firstname} ${data.lastname}<span>
                `
            }).appendTo('.copsPage');

            $(div).click(function() {
                openPlayerPage(data)
            })
        })
    })


    $(".criminalsPage").empty()
    data.suclular.forEach(suclu => {
        oyuncular.filter(oyuncu => oyuncu.identifier.includes(suclu)).forEach(data => {
            console.log(data)
            let div = $('<div/>', {
                'class':'added-tutanak',
                'html':`
                    <i class="far fa-times-circle" diabled></i>
                    <span>${data.firstname} ${data.lastname}<span>
                `
            }).appendTo('.criminalsPage');
            $(div).click(function() {
                openPlayerPage(data)
            })
        })
    })

    $("#evidenceButton").empty()
    let button = $('<div/>', {
        'class':'tutanak-bottom-buttons',
        'id': "delilarisivi",
        'html':`
            <i class="far fa-folder-open"></i>
            Delil Arşivini Görüntüleyin
        `
    }).appendTo('#evidenceButton');

    $(button).click(function() {
        $.post('http://sand-mdt/closeMDT', JSON.stringify())
        $.post('http://sand-mdt/openEvidence', JSON.stringify({
            id: data.id
        }))

    })

    $(".cezalar-tutanak").empty()
    cezalar.forEach(suc => {
        data.cezalar.forEach(ceza => {
            if (ceza == suc.id) {
                let div = $('<div/>', {
                    'class':'tutanak-suc',
                    'html':`
                        <div class="tutanak-suc-cezalar">
                            <div style="background-color: var(--ceza1);">${suc.money}</div>
                            <div style="background-color: var(--bir);"> ${suc.prison} </div>
                            <div style="background-color: var(--ceza3);">${suc.public}</div>
                        </div>
                        <span>${suc.isim}</span>
                    `
                }).appendTo('.cezalar-tutanak');
            }
        })

    })


}

$("#deleteButton").click(function() {
    $.post('http://sand-mdt/deleteTutanak', JSON.stringify({
        tutanak_id: $("#deleteButton").attr("tutanak-id") 
    }))

    $(".tutanak-home-page").show();
    sayfaDegistir(".tutanaklar")
    tutanaklariAyarla()
})


$("#player-photo").click(function() {
    $.post('http://sand-mdt/closeMDT', JSON.stringify())
    $.post('http://sand-mdt/take-photo', JSON.stringify({}), function(url) {
        if (url != "") {

            $.post('http://sand-mdt/closeMDT', JSON.stringify())
            $('#player-photo').attr('src', url);
            $.post('http://sand-mdt/setPP', JSON.stringify({ playerid: $("#player-photo").attr("player-id"), url }))
        }
    });
})

function addReportPage() {
    $("#criminalsInput").empty();
    $("#copsInput").empty();
    $("#tutanak-olustur-id").html(tutanaklar.length + 1)

    oyuncular.forEach(citizen => {
        if (citizen.job == "police") {
            $('<option/>', {
                'html': `${citizen.firstname} ${citizen.lastname}`
            }).attr({
                'data-citizenid': `${citizen.identifier}`
            }).appendTo('#copsInput');
        } else {

            $('<option/>', {
                'html': `${citizen.firstname} ${citizen.lastname}`
            }).attr({
                'data-citizenid': `${citizen.identifier}`
            }).appendTo('#criminalsInput');
        }
    });

    $(".cezalar-tutanak").empty()
    cezalar.forEach(suc => {
        let div = $('<div/>', {
            'class':'tutanak-suc',
            'html':`
                <div class="tutanak-suc-cezalar">
                    <div style="background-color: var(--ceza1);">${suc.money}</div>
                    <div style="background-color: var(--bir);"> ${suc.prison} </div>
                    <div style="background-color: var(--ceza3);">${suc.public}</div>
                </div>
                <span>${suc.isim}</span>
            `
        }).attr({
            'id': `${suc.id}`
        }).appendTo('.cezalar-tutanak');

        $(div).click(function() {
            if ( $(this).hasClass("cezalar-tutanak-selected")) {
                $(this).removeClass("cezalar-tutanak-selected")
            } else {
                $(this).addClass("cezalar-tutanak-selected")
            }
        })
    })

}

$("div.tutanak-suc-details").find("i").click(function() {
    var element = $(".cezalar-tutanak")
    
    if (element.css("display") == "flex") {
        $(this).removeClass("fas fa-minus")
        $(this).addClass("fas fa-plus")
        element.css("display", "none")
    } else {
        $(this).removeClass("fas fa-plus")
        $(this).addClass("fas fa-minus")
        element.css("display", "flex")
    }
})

$(".tutanak-save").click(function() {

    polisler = []
    suclular = []
    ceza = []

    var description = $("#tutanak-textarea").val();
    

    $('.addet-tutanak-cops > span').each(function() {
        var cop = oyuncular.find(oyuncu => oyuncu.firstname == $(this).html().split(' ')[0] && oyuncu.lastname == $(this).html().split(' ')[1]);
        polisler.push(cop.identifier);
    });

    $('.addet-tutanak-criminals > span').each(function() {
        var criminal = oyuncular.find(oyuncu => oyuncu.firstname == $(this).html().split(' ')[0] && oyuncu.lastname == $(this).html().split(' ')[1]);
        suclular.push(criminal.identifier);
    });

    $(".cezalar-tutanak-selected").each(function() {
        ceza.push($(this).attr("id"))
    })


    $.post('http://sand-mdt/saveReport', JSON.stringify({
        cops: polisler,
        desc: description,
        crim: suclular,
        ceza
    }))


    $(".tutanak-home-page").show();
    sayfaDegistir(".tutanaklar")
})

function tutanaklariAyarla() {
    let pageCount = Math.ceil(tutanaklar.length / pagesRow.tutanak)
    $("div.ileri-geri-buttons").find("span > p:last-child").html(pageCount)
    $("div.ileri-geri-buttons").find("span > p:first-child").html(pages.tutanak)

    let gullu = pagesRow.tutanak * pages.tutanak 

    $(".tutanaklar-bottom").empty();
    for (let i = gullu; i < pagesRow.tutanak + gullu; i++) {
        let data = tutanaklar[i]
        let div = $('<div/>', {
            'class':'tutanak',
            'html':`
                <div class="tutanak-header">
                    <span>${data.id}. Tutanak</span>
                    <div class="tutanak-members">
                        <div>${data.polisler.length} Polis</div>
                        <div>${data.suclular.length} Suclu</div>
                    </div>
                </div>

                <div class="tutanak-middle">
                    <span>${data.description}</span>
                </div>
                <div class="tutanak-header"></div>
            `
        }).appendTo('.tutanaklar-bottom');

        $(div).click(function() {
            previusPage = ".tutanak-home-page"
            setupTutanaklar(data)
        })
    }
        
}

$("div.ileri-geri-buttons").find("div:last-child").click(function() {
    let data = $(this.parentNode).attr("data")
    switch (data) {
        case "tutanak":
            if (pages.tutanak < tutanaklar.length / pagesRow.tutanak ) {
                pages.tutanak++
                tutanaklariAyarla()
            }

            break;
        case "search": 
            pages.arama++
            setupSearchElements()
            break;

    }    
}) 

$("div.ileri-geri-buttons").find("div:first-child").click(function() {
    let data = $(this.parentNode).attr("data")
    switch (data) {
        case "tutanak":
            if (pages.tutanak > 0 ) {
                pages.tutanak--
                tutanaklariAyarla()
            }
            break;
        case "search": 
            pages.arama--
            setupSearchElements()
            break;

    }
}) 

function aramakaydiara(text) {

    let aramaIndex = $("div.arananlar-oncelik > div > p.selected-arananlar").html()
    $(".arama-kaydi-sonuc").empty();
    $(".arama-kaydi-sonuc").show();


    oyuncular.forEach(data => {
        if (data.araniyor == parseInt(aramaIndex) || data.firstname.toLowerCase().includes(text) || data.lastname.toLowerCase().includes(text)) {
            aramakaydiyapistir(data, getColor(data.araniyor))
        }
    })
}

$("#arananlar-temizle").click(function() {
    $("div.arananlar-oncelik > div > p.selected-arananlar").removeClass("selected-arananlar")
    $("#search-arananlar").val("");
    $(".arama-kaydi-sonuc").hide();
    $(".arama-kaydi-sonuc").empty();


})

$("div.arananlar-oncelik > div > p").click(function() {
    $("div.arananlar-oncelik > div > p").each(function() {
        if ($(this).hasClass("selected-arananlar")) {
            $(this).removeClass("selected-arananlar")
        }
    })


    $(this).addClass("selected-arananlar")
    $("#search-arananlar").val(" ");

    aramakaydiara()
})

function aramakaydiyapistir(data, color) {

    let img
    if (data.mdt_img == null || data.mdt_img == undefined || data.mdt_img == "") {
        img = "https://cdn.discordapp.com/attachments/833463851550769222/833547585590788136/blank-profile-picture-973460_1280.png"
    } else {
        img = data.mdt_img
    }


    let div = $('<div/>', {
        'class':'searched-player',
        'html':`
            <img src="${img}">
            <p>
                ${data.firstname} ${data.lastname}
                <i class="fas fa-circle" style="color: ${color};"></i>
            </p>
            <div class="searched-player-details">
                <div class="searched-player-info">
                    <div>
                        <span>Meslek</span>
                        <span>${data.job}</span>
                    </div>
                    <div>
                        <span>Kimlik Numarası</span>
                        <span>#${data.id}</span>
                    </div>
                    <div>
                        <span>Banka Bakiyesi</span>
                        <span>$ ${data.bank}</span>
                    </div>
                    <div>
                        <span>Cinsiyet</span>
                        <span>${setupPlayerSex(data.sex)}</span>
                    </div>
                    <div>
                        <span>Doğum Tarihi</span>
                        <span>${data.dateofbirth}</span>
                    </div>
                    <div>
                        <span>Telefon Numarası</span>
                        <span>${data.phone}</span>
                    </div>
                    
                </div>
            </div>
            `
    }).appendTo('.arama-kaydi-sonuc');

    $(div).click(function() {
        openPlayerPage(data)
    })
}

$("#search-arananlar").keydown(function(key) {
    if (key.which == 13) {

        $("div.arananlar-oncelik > div > p").each(function() {
            if ($(this).hasClass("selected-arananlar")) {
                $(this).removeClass("selected-arananlar")
            }
        })

        aramakaydiara(this.value)
    }
})



function getColor(int) {
    let color
    switch (int) {
        case 1: 
            color = "var(--ceza1)";
            break;
        case 2: 
            color = "var(--sari);";
            break;
        case 3: 
            color = "var(--ceza3);";
            break;
    }
    return color;
}


