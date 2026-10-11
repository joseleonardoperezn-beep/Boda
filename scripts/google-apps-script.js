/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: Sincronización de Invitados para la Boda de Lis y Leo
 * =========================================================================
 * 
 * Instrucciones:
 * 1. En tu hoja de cálculo de Google Sheets, ve a: Extensiones > Apps Script.
 * 2. Borra el código existente y pega este archivo completo.
 * 3. Modifica la variable API_URL con la URL de tu proyecto desplegado en Vercel.
 * 4. Guarda con Ctrl + S y recarga la hoja de cálculo de Google Sheets.
 * 5. Aparecerá un nuevo menú llamado "💍 Boda Lis y Leo" en la barra superior.
 */

// URL de tu proyecto en Vercel (cuando lo despliegues)
const API_URL = "https://tu-proyecto.vercel.app/api/sync-guests";

// Mismo token secreto que configuraste en tus variables de entorno de Vercel
const SECRET_TOKEN = "boda_secreta_lis_y_leo_2026";

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('💍 Boda Lis y Leo')
    .addItem('✨ Sincronizar Invitados con la Web', 'sincronizarInvitados')
    .addToUi();
}

function sincronizarInvitados() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('La hoja no contiene datos de invitados (solo encabezados).');
    return;
  }

  const guests = [];
  
  // Recorremos las filas desde la fila 2 (índice 1) ignorando el encabezado
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const id = row[0];         // Columna A: ID / Slug
    const name = row[1];       // Columna B: Nombre / Familia
    const dedication = row[2]; // Columna C: Dedicatoria
    const phone = row[3];      // Columna D: Teléfono

    if (id && name) {
      guests.push({
        id: String(id).trim(),
        name: String(name).trim(),
        dedication: String(dedication || '').trim(),
        phone: phone ? String(phone).trim() : null,
        rowIndex: i + 1, // Para saber en qué fila de la hoja escribir el enlace
      });
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('Conectando con la base de datos...', 'Sincronizando');

  try {
    const response = UrlFetchApp.fetch(API_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        token: SECRET_TOKEN,
        guests: guests,
      }),
      muteHttpExceptions: true,
    });

    const statusCode = response.getResponseCode();
    const result = JSON.parse(response.getContentText());

    if (statusCode === 200 && result.success && result.data) {
      // Escribir los enlaces generados en la Columna E (Columna 5)
      result.data.forEach((item, index) => {
        const row = guests[index].rowIndex;
        sheet.getRange(row, 5).setValue(item.url);
      });

      SpreadsheetApp.getUi().alert(
        '✅ ¡Sincronización Exitosa!',
        `Se han sincronizado ${result.count} invitados en la base de datos de la web.\n\nLos enlaces personalizados de WhatsApp están listos en la Columna E para copiar y enviar.`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      throw new Error(result.error || `Error del servidor (${statusCode})`);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Error al sincronizar: ' + error.message);
  }
}

