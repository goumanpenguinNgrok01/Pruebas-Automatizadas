const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { describe, it } = require("mocha");
const { create } = require("mochawesome");

describe("Inicio de sesión en GitHub", () => {
  it("Debería iniciar sesión con éxito", async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    let folderName = "Capturas Inicio Sesión";
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }

      await driver.get(
        "https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fgithub"
      );
      await takeScreenshot(driver, folderName, "1_login_page.png");

      await driver.wait(until.elementLocated(By.id("login_field")), 5000);
      await driver
        .findElement(By.id("login_field"))
        .sendKeys("goumanpenguinNgrok01", Key.RETURN);
      await takeScreenshot(driver, folderName, "2_username_entered.png");

      await driver.wait(until.elementLocated(By.id("password")), 5000);
      await driver
        .findElement(By.id("password"))
        .sendKeys("Pantonio2404#", Key.RETURN);
      await takeScreenshot(driver, folderName, "3_password_entered.png");

      console.log("Prueba exitosa.");
    } catch (error) {
      console.error("Error en la prueba:", error);
      await takeScreenshot(driver, folderName, "error_screenshot.png");
    } finally {
      generateReport();
    }
  });
});

async function takeScreenshot(driver, folder, filename) {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  let filePath = path.join(folderPath, filename);
  let counter = 1;
  while (fs.existsSync(filePath)) {
    const [basename, ext] = filename.split(".");
    filename = `${basename}_${counter}.${ext}`;
    filePath = path.join(folderPath, filename);
    counter++;
  }

  const screenshot = await driver.takeScreenshot();
  fs.writeFileSync(filePath, screenshot, "base64");
}

async function generateReport() {
  console.log("Generando reporte..."); 
  const report = create(); 
  report.generate();
}
