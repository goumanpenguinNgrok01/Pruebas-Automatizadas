const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { describe, it, after } = require("mocha");
const { create } = require("mochawesome");

describe("Cambio de visibilidad de repositorio en GitHub a Privado", () => {
  it("Cambio de visibilidad de repositorio de un repositorio con éxito", async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    let folderName = "Capturas Cambiar Visibilidad a Privado";
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

      let avatarImage = await driver.wait(
        until.elementLocated(By.css("img.avatar.circle")),
        5000
      );
      await avatarImage.click();
      await takeScreenshot(driver, folderName, "avatar_image_clicked.png");

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//span[@class="ActionListItem-label" and contains(text(), "Your repositories")]'
          )
        ),
        5000
      );

      await driver
        .findElement(
          By.xpath(
            '//span[@class="ActionListItem-label" and contains(text(), "Your repositories")]'
          )
        )
        .click();
      await takeScreenshot(driver, folderName, "your_repositories_clicked.png");

      await driver.wait(
        until.elementLocated(By.xpath('//a[contains(text(), "repo1")]')),
        10000
      );

      await driver
        .findElement(By.xpath('//a[contains(text(), "repo1")]'))
        .click();
      await takeScreenshot(driver, folderName, "repo1_clicked.png");

      await driver.wait(until.elementLocated(By.id("settings-tab")), 20000);

      await driver.findElement(By.id("settings-tab")).click();
      await takeScreenshot(driver, folderName, "settings_tab_clicked.png");

      await driver.wait(
        until.elementLocated(
          By.xpath('//span[contains(text(), "Change visibility")]')
        ),
        15000
      );

      await driver
        .findElement(By.xpath('//span[contains(text(), "Change visibility")]'))
        .click();
      await takeScreenshot(driver, folderName, "change_visibility_clicked.png");

      await driver.wait(
        until.elementLocated(By.className("ActionList-item-label")),
        15000
      );

      await driver.findElement(By.className("ActionList-item-label")).click();
      await takeScreenshot(driver, folderName, "change_to_private_clicked.png");

      await driver.wait(
        until.elementLocated(By.id("repo-visibility-proceed-button-private")),
        5000
      );
      await driver
        .findElement(By.id("repo-visibility-proceed-button-private"))
        .click();
      await takeScreenshot(
        driver,
        folderName,
        "want_to_make_private_clicked.png"
      );

      await driver.wait(
        until.elementLocated(By.id("repo-visibility-proceed-button-private")),
        5000
      );
      await driver
        .findElement(By.id("repo-visibility-proceed-button-private"))
        .click();
      await takeScreenshot(
        driver,
        folderName,
        "read_and_understand_clicked.png"
      );

      await driver.wait(
        until.elementLocated(By.id("repo-visibility-proceed-button-private")),
        5000
      );
      await driver
        .findElement(By.id("repo-visibility-proceed-button-private"))
        .click();
      await takeScreenshot(driver, folderName, "make_private_clicked.png");
      console.log("Visibilidad Cambiada exitosamente.");
    } catch (error) {
      console.error("Error al crear el repositorio:", error);
      await takeScreenshot(driver, folderName, "error_screenshot.png");
    } finally {
      generateReport();
      await driver.quit();
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
