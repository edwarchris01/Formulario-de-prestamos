
$(document).ready(function () {
  let fecha;
  $("#fecha_prestamo").change((e) => {
    fecha = $(e.target).val();
    cacularfecha(fecha)
      .then((result) => {
        // si la promesa se resulve correctamente, muestra el resultado
        $("#cuotaP").val(result.Cuotapendiente);
      })
      .catch((err) => {
        // si la promesa se resulve incorrectamente, muestra el error
        console.error("Error al calcular", err);
      });
  });

  // lee todo el documento y que trabaje con todo lo que esta dentro
 
  $("#valorPres").keyup((e) => {
    const valor_pres = parseFloat($(e.target).val());
    const cuotas_pendientes = parseInt($("#cuotaP").val());
    const valor_interes = parseInt($("#interes").val());
    const tot =
      valor_pres + ((valor_pres * valor_interes) / 100) * cuotas_pendientes;
    $("#total").val(tot);
  });
  // $("#botonModal").click((e) => {
  $("#pago").on("show.bs.modal", (e) => {
    const form = $(".formulario")[0];

    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      form.classList.add("was-validated");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
      return;
    } else {
      let interes = parseFloat($("#interes").val());
      let valor_pres = parseFloat($("#valorPres").val());

      parseFloat($("#intereses").val(interes));
      const tot = $("#total").val();

      let pendiente = parseFloat($("#cuotaP").val());

      let deuda_actual;

      if (valor_pres < tot && pendiente !== 0) {
        deuda_actual = valor_pres;
      } else {
        deuda_actual = tot;
      }

      let valInt = parseFloat(deuda_actual * parseFloat(interes)) / 100;

      let deuda = tot;
      interes = $("#interes").val();
      $("#total").val() !== ""
        ? (deuda = $("#total").val())
        : (deuda = $("#valor_Pres").val());

      $("#valor_Pres").val(tot);

      $("#intereses").val(interes);

      $("#valor_pres").val(tot);

      $("#valor_Pagar").keyup((e) => {
        //funcion call back
        let pago = $(e.target).val();

        calcularPago(pago, deuda, valInt, pendiente)
          .then((resultado) => {
            // una promesa
            $("#cuota").val(resultado.numCuota);
            $("#valorInteres").val(resultado.pagoInteres);
            $("#pagoCapital").val(resultado.pagoCapital);
            $("#ValorActual").val(resultado.valorActual);

            $("#Guardar").click((e) => {
              $("#total").val(resultado.valorActual);
            });
          })
          .catch((error) => {
            console.error("error al calcular", error);
          });
      });
    }
  });

  function calcularPago(p, d, v, cp) {
    return new Promise((resolve, reject) => {
      let cuota = (p / v).toFixed(1);
      let valActual;
      let pago_interes;

      if (p !== 0 && cuota <= cp) {
        pago_interes = parseFloat(cuota * v);
        valActual = d - pago_interes;
      } else {
        pago_interes = parseFloat(cp) * v;
        valActual = d - p;
      }

      let capital = p - pago_interes;

      if (cuota >= 0) {
        resolve({
          numCuota: Number(cuota),
          pagoCapital: Number(capital),
          pagoInteres: Number(pago_interes),
          valorActual: Number(valActual),
        });
      } else {
        reject("el calculo de la cuota es invalido");
      }
    });
  }

  //calcula la fecha para aumentar los intereses
  function cacularfecha(fec) {
    return new Promise((resolve, reject) => {
      let fecha_pres = new Date(fec);
      let fechaActual = new Date();
      // Calcular la diferencia en años y meses
      let difAnios = fechaActual.getFullYear() - fecha_pres.getFullYear();
      let difMes = fechaActual.getMonth() - fecha_pres.getMonth();
      let difdia = fechaActual.getDate() - fecha_pres.getDate();
      //Si la diferencia de los dias es negativa no ha pasado un mes
      if (difdia <= 0) {
        difMes -= 1;
      }
      let pendiente = difAnios * 12 + difMes;
      if (pendiente === 0) {
        pendiente = 1;
      }
      resolve({
        Cuotapendiente: pendiente,
      });
      reject("El cálculo de la cuota pendiente es invalida.");
    });
  }

  function limpiar() {
    let modal = $("#pago").find("input");
    modal.each(function () {
      $(this).val("");
    });
  }

  $("#Guardar").click((e) => {
    Swal.fire({
      icon: "success",
      title: "Guardado",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      let cuota = $("#cuota").val();
      let cuotap = $("#cuotaP").val();

      if (cuota > cuotap) {
        cuotap = 0;
        $("#cuotaP").val(cuotap);
      } else {
        cuotap = cuotap - cuota;
        $("#cuotaP").val(cuotap);
      }

      $("#total").val($("#ValorActual").val());
      $("#pago").modal("hide");
      limpiar();
    });
  });

  $("#btncerrar").click(function () {
    limpiar();
  });
});
