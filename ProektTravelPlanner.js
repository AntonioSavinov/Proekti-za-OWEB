let najaven = "";
let izbranGrad = "";
let kategorii = ["Езеро", "Планина", "Град", "Скијалиште", "Национален парк", "Манастир", "Бања", "Историски локалитет"];
let destinacii = [
    { ime: "Охрид", kategorija: "Езеро", prevoz: 20, dnevno: 70,
      slike: ["Iglesia San Juan Kaneo, Ohrid, Macedonia del Norte, 2014-04-17, DD 19.jpg",
              "Iglesia San Juan Kaneo, Ohrid, Macedonia del Norte, 2014-04-17, DD 22.jpg"] },
    { ime: "Скопје", kategorija: "Град", prevoz: 0, dnevno: 45,
      slike: ["Stone Bridge Skopje 4.jpg", "08 Skopje.jpg"] },
    { ime: "Маврово", kategorija: "Национален парк", prevoz: 15, dnevno: 55,
      slike: ["Св. Никола Маврово.jpg",
              "Torreón de la presa del lago Mavrovo, Macedonia del Norte, 2014-04-17, DD 28.jpg"] },
    { ime: "Дојран", kategorija: "Езеро", prevoz: 18, dnevno: 50,
      slike: ["Наколно живеалиште во Дојранско Езеро.jpg", "Dojran Lake 209.jpg"] },
    { ime: "Крушево", kategorija: "Планина", prevoz: 15, dnevno: 50,
      slike: ["Makedonium 030.JPG", "Nikola Karev Denkmal in Krusevo, Makedonien.JPG"] },
    { ime: "Битола", kategorija: "Град", prevoz: 12, dnevno: 45,
      slike: ["BitolaPanorama.jpg", "Саат кула во Битола.jpg"] },
    { ime: "Пелистер", kategorija: "Национален парк", prevoz: 12, dnevno: 50,
      slike: ["Pogled kon Golemo ezero Pelister.jpg", "Пелистер 02.jpg"] }
];
let galerija = {};

function napraviOpcii(lista) {
    let rezultat = "";
    for (let i = 0; i < lista.length; i++) {
        rezultat += "<option>" + lista[i] + "</option>";
    }
    return rezultat;
}

function popolniSelect(id, html) {
    let select = document.getElementById(id);
    let staro = select.value;
    select.innerHTML = html;
    if (staro != "") {
        select.value = staro;
    }
    if (select.selectedIndex < 0) {
        select.selectedIndex = 0;
    }
}

function napraviSliki(ime, fajlovi) {
    if (!fajlovi) fajlovi = [];
    galerija[ime] = [];
    for (let i = 0; i < fajlovi.length; i++) {
        galerija[ime].push({
            url: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(fajlovi[i]) + "?width=600",
            lajk: 0,
            dislajk: 0,
            komentari: []
        });
    }
}

function prikaziDestinacii() {
    let iminja = [];
    for (let i = 0; i < destinacii.length; i++) {
        iminja.push(destinacii[i].ime);
    }
    let opciiIminja = napraviOpcii(iminja);
    popolniSelect("filterDestinacija", "<option value='site'>Сите дестинации</option>" + opciiIminja);
    popolniSelect("kalkGrad", opciiIminja);
    popolniSelect("anketaDestinacija", opciiIminja);
    let kat = document.getElementById("filterKategorija").value;
    let dest = document.getElementById("filterDestinacija").value;
    let maxBudget = document.getElementById("maxBudget").value;
    let html = "";
    for (let i = 0; i < destinacii.length; i++) {
        let d = destinacii[i];
        if (kat != "site" && d.kategorija != kat) continue;
        if (dest != "site" && d.ime != dest) continue;
        if (maxBudget != "" && d.dnevno > Number(maxBudget)) continue;
        let kopceIzbrisi = "";
        if (najaven) {
            kopceIzbrisi = "<button class='btn btn-danger btn-sm' data-akcija='izbrisi' data-index='" + i + "'>Избриши</button>";
        }
        html += "<div class='col-md-4 mb-3'><div class='card text-center h-100'><div class='card-body'>" +
            "<h5 class='card-title'>" + d.ime + "</h5>" +
            "<span class='badge badge-info mb-2'>" + d.kategorija + "</span>" +
            "<p class='card-text'>Превоз: " + d.prevoz + " € | Дневно: " + d.dnevno + " €</p>" +
            "<button class='btn btn-primary btn-sm' data-akcija='galerija' data-ime='" + d.ime + "'>Галерија</button> " +
            kopceIzbrisi +
            "</div></div></div>";
    }
    if (html == "") {
        html = "<div class='col-12'><div class='alert alert-warning'>Нема дестинации за избраниот филтер.</div></div>";
    }
    document.getElementById("listaDestinacii").innerHTML = html;
}

function izbrisi(i) {
    delete galerija[destinacii[i].ime];
    destinacii.splice(i, 1);
    prikaziDestinacii();
    prikaziGalerija();
}

function dodadiDestinacija(event) {
    event.preventDefault();
    let ime = document.getElementById("imeGrad").value;
    let novaDestinacija = {
        ime: ime,
        kategorija: document.getElementById("kategorija").value,
        prevoz: Number(document.getElementById("prevoz").value),
        dnevno: Number(document.getElementById("dnevno").value)
    };
    destinacii.push(novaDestinacija);
    napraviSliki(ime);        
    prikaziDestinacii();
    document.getElementById("formaDestinacija").reset();
}

function presmetaj() {
    let ime = document.getElementById("kalkGrad").value;
    let denovi = Number(document.getElementById("kalkDenovi").value);
    let lugje = Number(document.getElementById("kalkLugje").value);
    let d = null;
    for (let i = 0; i < destinacii.length; i++) {
        if (destinacii[i].ime == ime) d = destinacii[i];
    }
    if (d == null) return;
    let vkupno = (d.prevoz + d.dnevno * denovi) * lugje;
    document.getElementById("kalkRezultat").innerHTML =
        "<div class='alert alert-info mb-0'>" + ime + ": (" + d.prevoz + " + " + d.dnevno + " × " + denovi +
        ") × " + lugje + " = <b>" + vkupno + " €</b></div>";
}

function najavi(event) {
    event.preventDefault();
    if (document.getElementById("lozinka").value != "1234") {
        document.getElementById("greskaNajava").innerText = "Wrong password.";
        return;
    }
    najaven = document.getElementById("korisnik").value;
    document.getElementById("greskaNajava").innerText = "";
    document.getElementById("formaNajava").reset();
    osveziNajava();
}

function odjavi() {
    najaven = "";
    osveziNajava();
}

function osveziNajava() {
    document.getElementById("formaNajava").classList.toggle("d-none", najaven != "");
    document.getElementById("najavenPanel").classList.toggle("d-none", najaven == "");
    document.getElementById("formaDestinacija").classList.toggle("d-none", !najaven);
    document.getElementById("porakaNajava").classList.toggle("d-none", najaven != "");
    if (najaven) {
        document.getElementById("najavaInfo").innerText = "Hello, " + najaven;
    } else {
        document.getElementById("najavaInfo").innerText = "";
    }
    prikaziDestinacii();
}

function otvoriGrad(ime) {
    izbranGrad = ime;
    prikaziGalerija();
    location.hash = "galerija";     
}
function prikaziGalerija() {
    let sliki = galerija[izbranGrad];
    if (!sliki) {
        document.getElementById("galerijaGrad").innerText = "";
        document.getElementById("listaGalerija").innerHTML = "";
        return;
    }
    document.getElementById("galerijaGrad").innerText = izbranGrad;
    if (sliki.length == 0) {
        document.getElementById("listaGalerija").innerHTML =
            "<div class='col-12'><div class='alert alert-warning'>Нема слики за оваа дестинација.</div></div>";
        return;
    }
    let html = "";
    for (let i = 0; i < sliki.length; i++) {
        let s = sliki[i];
        let komentari = "";
        for (let j = 0; j < s.komentari.length; j++) {
            komentari += "<div class='komentar-balon'>" + s.komentari[j] + "</div>";
        }
        html += "<div class='col-md-6 mb-3'><div class='card'>" +
            "<img src='" + s.url + "' class='card-img-top' alt='" + izbranGrad + "'>" +
            "<div class='card-body'>" +
                "<div class='galerija-glasovi'>" +
                    "<button class='btn btn-success btn-sm' data-akcija='glasaj' data-tip='lajk' data-index='" + i + "'>Like " + s.lajk + "</button>" +
                    "<button class='btn btn-danger btn-sm' data-akcija='glasaj' data-tip='dislajk' data-index='" + i + "'>Dislike " + s.dislajk + "</button>" +
                "</div>" +
                "<div class='input-group input-group-sm'>" +
                    "<input type='text' id='komentar" + i + "' class='form-control komentar-input' data-index='" + i + "' placeholder='Напиши коментар...'>" +
                    "<div class='input-group-append'><button class='btn btn-komentar' data-akcija='komentar' data-index='" + i + "'>Објави</button></div>" +
                "</div>" +
                "<div class='komentari-lista'>" + komentari + "</div>" +
            "</div></div></div>";
    }
    document.getElementById("listaGalerija").innerHTML = html;
}

function glasaj(i, tip) {
    galerija[izbranGrad][i][tip]++;
    prikaziGalerija();
}

function dodajKomentar(i) {
    let tekst = document.getElementById("komentar" + i).value;
    if (tekst == "") return;
    galerija[izbranGrad][i].komentari.push(tekst);
    prikaziGalerija();
}

function isprati(event) {
    event.preventDefault();
    let ime = document.getElementById("anketaIme").value;
    let email = document.getElementById("anketaEmail").value;
    let vozrast = document.getElementById("anketaVozrast").value;
    let omilena = document.getElementById("anketaDestinacija").value;
    let ocena = document.getElementById("anketaOcena").value;
    let komentar = document.getElementById("anketaKomentar").value;
    let chestota = document.querySelector("input[name=chestota]:checked").value;
    let izvor = document.querySelector("input[name=izvor]:checked").value;
    let preporaka = document.querySelector("input[name=preporaka]:checked").value;
    let interesi = [];
    let stikliraniInteresi = document.querySelectorAll("input[name=interesi]:checked");
    for (let i = 0; i < stikliraniInteresi.length; i++) {
        interesi.push(stikliraniInteresi[i].value);
    }
    let interesiTekst = "ништо посебно";
    if (interesi.length > 0) {
        interesiTekst = interesi.join(", ");
    }
    if (omilena == "") omilena = "-";
    let redKomentar = "";
    if (komentar != "") {
        redKomentar = "<li>Коментар: „" + komentar + "“</li>";
    }
    let redNewsletter = "";
    if (document.getElementById("anketaNewsletter").checked) {
        if (email == "") email = "(no email entered)";
        redNewsletter = "<li>Патни совети на: " + email + "</li>";
    }
    document.getElementById("rezultatAnketa").innerHTML =
        "<div class='anketa-rezultat'><h5>Благодариме, " + ime + "! </h5><ul class='mb-0'>" +
        "<li>Оцена: <b>" + ocena + "/10</b></li>" +
        "<li>Возраст: " + vozrast + "</li>" +
        "<li>Омилена дестинација: " + omilena + "</li>" +
        "<li>Патување: " + chestota + "</li>" +
        "<li>Извор: " + izvor + "</li>" +
        "<li>Ти се допадна: " + interesiTekst + "</li>" +
        "<li>Би го препорачал: " + preporaka + "</li>" +
        redKomentar +
        redNewsletter +
        "</ul></div>";
}

function klikDestinacii(event) {
    let kopce = event.target.closest("button");
    if (kopce == null) return;

    if (kopce.dataset.akcija == "galerija") {
        otvoriGrad(kopce.dataset.ime);
    }
    if (kopce.dataset.akcija == "izbrisi") {
        izbrisi(Number(kopce.dataset.index));
    }
}

function klikGalerija(event) {
    let kopce = event.target.closest("button");
    if (kopce == null) return;

    if (kopce.dataset.akcija == "glasaj") {
        glasaj(Number(kopce.dataset.index), kopce.dataset.tip);
    }
    if (kopce.dataset.akcija == "komentar") {
        dodajKomentar(Number(kopce.dataset.index));
    }
}

function enterGalerija(event) {
    if (event.key == "Enter" && event.target.classList.contains("komentar-input")) {
        dodajKomentar(Number(event.target.dataset.index));
    }
}

function promeniOcena() {
    document.getElementById("ocenaBroj").innerText = document.getElementById("anketaOcena").value;
}

function start() {
    document.getElementById("filterKategorija").innerHTML = "<option value='site'>Сите категории</option>" + napraviOpcii(kategorii);
    document.getElementById("kategorija").innerHTML = napraviOpcii(kategorii);
    for (let i = 0; i < destinacii.length; i++) {
        napraviSliki(destinacii[i].ime, destinacii[i].slike);
    }
    document.getElementById("filterKategorija").addEventListener("change", prikaziDestinacii);
    document.getElementById("filterDestinacija").addEventListener("change", prikaziDestinacii);
    document.getElementById("maxBudget").addEventListener("input", prikaziDestinacii);
    document.getElementById("btnPresmetaj").addEventListener("click", presmetaj);
    document.getElementById("formaNajava").addEventListener("submit", najavi);
    document.getElementById("btnOdjava").addEventListener("click", odjavi);
    document.getElementById("formaDestinacija").addEventListener("submit", dodadiDestinacija);
    document.getElementById("listaDestinacii").addEventListener("click", klikDestinacii);
    document.getElementById("listaGalerija").addEventListener("click", klikGalerija);
    document.getElementById("listaGalerija").addEventListener("keydown", enterGalerija);
    document.getElementById("anketaOcena").addEventListener("input", promeniOcena);
    document.getElementById("formaAnketa").addEventListener("submit", isprati);
    osveziNajava();
}
document.addEventListener("DOMContentLoaded", start);
