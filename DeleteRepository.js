const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { describe, it, after } = require("mocha");
const { create } = require("mochawesome");

describe("Eliminación de repositorio en GitHub", () => {
  it("eliminar un repositorio con éxito", async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    let folderName = "Capturas Eliminar Repositorio";
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
      await takeScreenshot(driver, folderName, "security_tab_clicked.png");

      await driver.wait(
        until.elementLocated(
          By.xpath('//span[text()="Delete this repository"]')
        ),
        15000
      );
      await driver
        .findElement(By.xpath('//span[text()="Delete this repository"]'))
        .click();
      await takeScreenshot(
        driver,
        folderName,
        "delete_repository_button_clicked.png"
      );

      await driver.wait(
        until.elementLocated(
          By.xpath('//span[text()="I want to delete this repository"]')
        ),
        5000
      );
      await driver
        .findElement(
          By.xpath('//span[text()="I want to delete this repository"]')
        )
        .click();
      await takeScreenshot(
        driver,
        folderName,
        "i_want_to_delete_repository_button_clicked.png"
      );

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//span[contains(text(), "I have read and understand these effects")]'
          )
        ),
        5000
      );
      await driver
        .findElement(
          By.xpath(
            '//span[contains(text(), "I have read and understand these effects")]'
          )
        )
        .click();
      await takeScreenshot(
        driver,
        folderName,
        "read_and_understand_button_clicked.png"
      );

      await driver.wait(
        until.elementLocated(By.id("verification_field")),
        5000
      );
      await driver
        .findElement(By.id("verification_field"))
        .sendKeys("goumanpenguinNgrok01/repo1");
      await takeScreenshot(driver, folderName, "verification_field_filled.png");

      await driver.wait(
        until.elementLocated(By.id("repo-delete-proceed-button")),
        5000
      );
      await driver.findElement(By.id("repo-delete-proceed-button")).click();
      await takeScreenshot(
        driver,
        folderName,
        "repo_delete_proceed_button_clicked.png"
      );

      console.log("Repositorio eliminado exitosamente.");
    } catch (error) {
      console.error("Error al crear o eliminar el repositorio:", error);
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
