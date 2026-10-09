// app/src/jobs/seat-lock-purger.job.ts

/**
 * Cronjob de purga de bloqueos expirados
 * ---------------------------------------------------------
 * Cada minuto elimina físicamente los bloqueos de sillas cuya vigencia
 * expiró, para que las sillas vuelvan automáticamente al estado Disponible
 * aunque nadie consulte el mapa.
 *
 * La corrección NO depende de este job: toda lectura y bloqueo filtra por
 * vigencia (expiración perezosa); este cron es limpieza periódica.
 */

import cron from "node-cron";
import cartSeatRepository from "../repositories/cart-seat.repository";

export const startSeatLockPurgerJob = (): void => {
  cron.schedule("* * * * *", async () => {
    try {
      const deleted = await cartSeatRepository.deleteExpired();
      if (deleted > 0) {
        console.log(
          `[seat-lock-purger] ${deleted} bloqueo(s) expirado(s) eliminado(s).`
        );
      }
    } catch (error) {
      console.error(
        "[seat-lock-purger] Error purgando bloqueos expirados:",
        error
      );
    }
  });

  console.log(
    "[seat-lock-purger] Cronjob iniciado (purga cada minuto)."
  );
};
