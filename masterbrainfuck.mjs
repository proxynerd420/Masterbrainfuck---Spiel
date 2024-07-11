import promptSync from 'prompt-sync';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';

const eingabe = promptSync({ sigint: true });

const blackDot = '\u25CF';
const whiteDot = '\u25CB';
const blueDot = '\u25CF';
const redDot = '\u25CF';
const yellowDot = '\u25CF';
const greenDot = '\u25CF';
const orangeDot = '\u25CF';
const purpleDot = '\u25CF';

function frageNachNamen() {
  const name = eingabe('Bitte gib deinen Namen ein (oder drücke Enter für Spieler*in): ') || 'Spieler*in';
  return name.trim();
}

function generiereGeheimeZahl() {
  let ziffern = [];
  for (let i = 0; i < 4; i++) {
    let ziffer = Math.floor(Math.random() * 6);
    ziffern.push(ziffer);
  }
  return ziffern.join('');
}

function gueltigeVermutung(tipp) {
  return /^[0-5]{4}$/.test(tipp);
}

function schwarzWeißZähler(geheimnis, tipp) {
  let schwarzePunkte = 0;
  let weißePunkte = 0;
  let geheimnisArray = geheimnis.split('');
  let tippArray = tipp.split('');

  for (let i = 0; i < 4; i++) {
    if (tippArray[i] === geheimnisArray[i]) {
      schwarzePunkte++;
      geheimnisArray[i] = null;
      tippArray[i] = null;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (tippArray[i] !== null && geheimnisArray.includes(tippArray[i])) {
      weißePunkte++;
      let index = geheimnisArray.indexOf(tippArray[i]);
      geheimnisArray[index] = null;
    }
  }

  return { schwarzePunkte, weißePunkte };
}

function zifferInFarbigenPunkt(ziffer) {
  switch (ziffer) {
    case '0':
      return chalk.blue(blueDot);
    case '1':
      return chalk.red(redDot);
    case '2':
      return chalk.yellow(yellowDot);
    case '3':
      return chalk.green(greenDot);
    case '4':
      return chalk.hex('#FFA500')(orangeDot);
    case '5':
      return chalk.hex('#800080')(purpleDot);
    default:
      return blackDot;
  }
}

function zahlInFarben(zahl) {
  return zahl.split('').map(zifferInFarbigenPunkt).join(' ');
}

const zufälligeNachrichten = [
  'Nicht aufgeben!',
  'Neuer Versuch - neues Glück!',
  'Der Weg ist das Ziel!',
  'Pech im Spiel ... ;)!',
  'Glücksspiele brauchen Glück - weiter so dann kommt es auch zu dir!',
  'Jeder neue Versuch ist eine neue Chance!',
  'Niederlagen sind nur Etappen auf dem Weg zum Ziel!',
  'Auch der längste Weg beginnt mit dem ersten Versuch!',
  'Erfolg ist kein Ziel, sondern eine Reise. Gib niemals auf!',
];

let highscores = [];

function zeigeHighscores() {
  console.log(chalk.bold.yellow('\nHighscores:'));
  highscores.sort((a, b) => a - b);
  highscores.slice(0, 10).forEach((score, index) => {
    console.log(chalk.green(`${index + 1}. ${score} Versuche`));
  });
}

function dasSpielStarten() {
  const spielerName = frageNachNamen();
  const geheimeNummer = generiereGeheimeZahl();

  console.log(
    chalk.bold.yellow.underline(`MASTERBRAINFUCK\n`) +
      chalk.bgWhite(
        chalk.black(
          chalk.bold.magenta(
            `Eine geheime Farbcombi wurde generiert. Versuch sie zu erraten!\n`
          ) +
            chalk.bgBlack(
              chalk.white(
                `Die schwarzen Punkte ${chalk.inverse(
                  blackDot
                )} bedeuten, du hast eine oder mehrere Farben an der richtigen Stelle.\n`
              )
            ) +
            `Die weißen Punkte ${chalk.inverse(
              whiteDot
            )} bedeuten, du hast eine oder mehrere Farben richtig, aber an der falschen Stelle.\n` +
            chalk.bgBlack(
              chalk.white(
                'Zahl ' +
                  chalk.blue('0') +
                  ' ergibt einen ' +
                  'blauen Punkt' +
                  chalk.blue(' ' + blueDot) +
                  '\n' +
                  'Zahl ' +
                  chalk.red('1') +
                  ' ergibt einen ' +
                  'roten Punkt' +
                  chalk.red(' ' + redDot) +
                  '\n' +
                  'Zahl ' +
                  chalk.yellow('2') +
                  ' ergibt einen ' +
                  'gelben Punkt' +
                  chalk.yellow(' ' + yellowDot) +
                  '\n' +
                  'Zahl ' +
                  chalk.green('3') +
                  ' ergibt einen ' +
                  'grünen Punkt' +
                  chalk.green(' ' + greenDot) +
                  '\n' +
                  'Zahl ' +
                  chalk.hex('#FFA500')('4') +
                  ' ergibt einen ' +
                  'orangefarbenen Punkt' +
                  chalk.hex('#FFA500')(' ' + orangeDot) +
                  '\n' +
                  'Zahl ' +
                  chalk.hex('#800080')('5') +
                  ' ergibt einen ' +
                  'lila Punkt' +
                  chalk.hex('#800080')(' ' + purpleDot)
              )
            )
        )
      )
  );

  chalkAnimation.rainbow(`Verstanden? Los geht's!`).start();

  let tipp;
  let versuche = 0;

  while (true) {
    tipp = eingabe('Gib eine 4-stellige Zahl ein (Ziffern 0-5): ');
    if (!gueltigeVermutung(tipp)) {
      console.log(
        chalk.bold.red(
          'Ungültige Eingabe! Stelle sicher, dass es eine 4-stellige Zahl mit Ziffern von 0-5 ist.'
        )
      );
      continue;
    }

    versuche++;
    const { schwarzePunkte, weißePunkte } = schwarzWeißZähler(geheimeNummer, tipp);
    console.log(`Dein Tipp: ${zahlInFarben(tipp)}`);

    if (schwarzePunkte === 4) {
      console.log(
        chalk.bgMagenta(`Herzlichen Glückwunsch, ${spielerName}!`) +
          ' ' +
          chalk.yellow(`Du hast die Farben`) +
          chalk.blue(' ' + zahlInFarben(geheimeNummer)) +
          chalk.yellow(` in `) +
          chalk.blue(versuche) +
          chalk.yellow(` Versuchen erraten.`)
      );

      // Highscore speichern und anzeigen
      highscores.push(versuche);
      zeigeHighscores();

      // Frage, ob der Spieler weiterspielen möchte
      const erneutSpielen = eingabe('Möchtest du noch eine Runde spielen? (j/n): ');
      if (erneutSpielen.toLowerCase() === 'j') {
        dasSpielStarten();
      } else {
        console.log(chalk.blue.bold('Danke fürs Spielen!'));
      }
      break;
    } else if (schwarzePunkte === 0 && weißePunkte === 0) {
      const nachrichtIndex = Math.floor(Math.random() * zufälligeNachrichten.length);
      const zufälligeNachricht = zufälligeNachrichten[nachrichtIndex];
      chalkAnimation.rainbow(zufälligeNachricht).start();
    } else {
      let schwarzePunkteAnzeige =
        schwarzePunkte > 0
          ? chalk.bgWhite(
              chalk.black(
                schwarzePunkte === 1
                  ? blackDot
                  : (blackDot + ' ').repeat(schwarzePunkte).trim()
              )
            )
          : '';
      let weißePunkteAnzeige =
        weißePunkte > 0
          ? chalk.bgBlack(
              chalk.white(
                weißePunkte === 1
                  ? whiteDot
                  : (whiteDot + ' ').repeat(weißePunkte).trim()
              )
            )
          : '';

      if (schwarzePunkte > 0 && weißePunkte > 0) {
        console.log(`${schwarzePunkteAnzeige}`);
        console.log(`${weißePunkteAnzeige}`);
      } else {
        console.log(`${schwarzePunkteAnzeige}${weißePunkteAnzeige}`);
      }
    }
  }
}

dasSpielStarten();
