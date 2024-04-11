const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { describe, it, after } = require("mocha");
const { create } = require("mochawesome");

describe("Creación de repositorio en GitHub", () => {
  it("Creación de un repositorio con éxito", async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    let folderName = "Capturas Crear Repositorio";
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }

      await driver.get(
        "https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fgithub"
      );
      await takeScreenshot(driver, folderName, "1_login_page.png"); // Captura de pantalla de la página de inicio de sesión de GitHub

      await driver.wait(until.elementLocated(By.id("login_field")), 5000); // Esperar hasta que se cargue el campo de nombre de usuario
      await driver
        .findElement(By.id("login_field"))
        .sendKeys("goumanpenguinNgrok01", Key.RETURN);
      await takeScreenshot(driver, folderName, "2_username_entered.png"); // Captura de pantalla después de introducir el nombre de usuario

      await driver.wait(until.elementLocated(By.id("password")), 5000); // Esperar hasta que se cargue el campo de contraseña
      await driver
        .findElement(By.id("password"))
        .sendKeys("Pantonio2404#", Key.RETURN);
      await takeScreenshot(driver, folderName, "3_password_entered.png"); // Captura de pantalla después de introducir la contraseña

      console.log("Primera parte exitosa.");

      await driver
        .findElement(By.css('[aria-label="Open global navigation menu"]'))
        .click();
      await takeScreenshot(driver, folderName, "5_menu_button_clicked.png");

      await driver.findElement(By.className("ActionListItem-label")).click();
      await takeScreenshot(driver, folderName, "6_home_link_clicked.png");

      let repoNameInput = await driver.wait(
        until.elementLocated(
          By.css('input[placeholder="name your new repository..."]')
        ),
        5000
      );
      await repoNameInput.sendKeys("repo1");
      await takeScreenshot(driver, folderName, "7_repository_name_entered.png");

      let publicVisibilityRadio = await driver.wait(
        until.elementLocated(
          By.css('input[name="repository[visibility]"][value="public"]')
        ),
        5000
      );
      await publicVisibilityRadio.click();
      await takeScreenshot(
        driver,
        folderName,
        "8_public_visibility_selected.png"
      );

      let createButton = await driver.wait(
        until.elementLocated(
          By.xpath('//span[contains(text(), "Create a new repository")]')
        ),
        5000
      );
      await createButton.click();
      await takeScreenshot(
        driver,
        folderName,
        "9_after_create_button_click.png"
      );

      
    
    } catch (error) {
      console.error("Error al crear el repositorio:", error);
      await takeScreenshot(driver, folderName, "error_screenshot.png");
    } finally {
      await driver.quit();
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
