
$(document).on('keydown keyup blur keypress', '.horariomask', function () {
    if ($(this).val().length <= 0) {
        $(this).css('border', '2px solid purple')
    }
    if ($(this).val().length >= 2 && $(this).attr('placeholder') == "Até") {
        let hr_at = $(this).val().substr(0, 2)
        let hr_an = $(this).parent().prev().children().val().substr(0, 2)

        if (hr_at < hr_an) {
            $(this).css('border', '2px solid red')
            $(this).attr('data-status', 'false')
        } else {
            $(this).css('border', '2px solid purple')
            $(this).attr('data-status', 'true')
        }

        if ($(this).val().length >= 5) {
            let min_at = $(this).val().substr(3, 2)
            let min_an = $(this).parent().prev().children().val().substr(3, 2)

            if ((hr_at < hr_an && min_at < min_an) || (hr_at == hr_an && min_at < min_an) || (hr_at < hr_an && min_at > min_an) || (hr_at < hr_an && min_at == min_an)) {
                $(this).css('border', '2px solid red')
                $(this).attr('data-status', 'false')
            } else {
                $(this).css('border', '2px solid purple')
                $(this).attr('data-status', 'true')
            }
        }
    }
    if ($(this).val().length >= 5) {
        $(this).css('background-color', 'white')
        $(this).parent().next().children().css('background-color', 'white').removeAttr('disabled').css('color', 'black').val('').css('border', '2px solid purple')
    } else {
        $(this).parent().nextAll().children().css('background-color', 'purple').attr('disabled', 'disabled').val('').val('Indisp').css('color', 'white')
    }
})

$(document).on('click', '.tooltipped', function () {
    $('.tooltipped').tooltip('close')
    $('.tooltipped').tooltip()
})

$(document).on('click', '.semanadia', function () {
    $(this).parent().parent().find('input').not(':first').val('Indisp').css('color', 'white').css('border', '2px solid purple').css('background-color', 'purple').attr('disabled', 'disabled').attr('readonly')
    $(this).parent().parent().find('input:first').val('').css('background-color', 'white')
})

$(document).on('click', '.save', function () {
    let i = 0;
    $('#tblHr tbody tr').find('.horariomask').not('input[name=seginp1], input[name=terinp1], input[name=quainp1], input[name=quiinp1], input[name=sexinp1], input[name=sabinp1],input[name=dominp1]').each(function () {

        if ($(this).val().length >= 1 && $(this).val().length <= 4) {
            i = 2;
            return false;
        } else if ($(this).attr('data-status') == "false" || $(this).css('border') == "2px solid rgb(255, 0, 0)") {
            i = 1;
            return false;
        } else if ($(this).attr('placeholder') == 'Até' && $(this).val() <= 0) {
            i = 3;
            return false;
        }
    })

    if (i == 1) {
        msgswal('Há horários incorretos!', 'Reveja os campos circulados por <b style="color:red">vermelho</b><br>' + 'A <b>2ª</b> parte do turno jamais pode ser menor que a <b>1ª</b>', 'error', 6000)
        return false;
    } else if (i == 2) {
        msgswal('Há horários incompletos!', 'O horário deve seguir o padrão → <b>XX:XX</b>', 'error', 3500)
        return false;
    } else {
        let segunda = [], terca = [], quarta = [], quinta = [], sexta = [], sabado = [], domingo = [];

        $('#tblHr .segunda').find('input').each(function () {
            segunda.push($(this).val())
        })

        $('#tblHr .terca').find('input').each(function () {
            terca.push($(this).val())
        })

        $('#tblHr .quarta').find('input').each(function () {
            quarta.push($(this).val())
        })

        $('#tblHr .quinta').find('input').each(function () {
            quinta.push($(this).val())
        })

        $('#tblHr .sexta').find('input').each(function () {
            sexta.push($(this).val())
        })

        $('#tblHr .sabado').find('input').each(function () {
            sabado.push($(this).val())
        })

        $('#tblHr .domingo').find('input').each(function () {
            domingo.push($(this).val())
        })

        $.ajax({
            url: '/cadastrarHorarioFuncionamento',
            type: 'POST',
            data: { segunda: segunda, terca: terca, quarta: quarta, quinta: quinta, sexta: sexta, sabado: sabado, domingo: domingo },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (data) {
                msgswal('Horário atualizado!', 'Horário de funcionamento salvo', 'success', 3500)
                $('.divLoader').css('display', 'none')
            }
        })
    }
})

var mask = function (val) {
    val = val.split(":");
    return (parseInt(val[0]) > 19) ? "HZ:M0" : "H0:M0";
}
pattern = {
    onKeyPress: function (val, e, field, options) {
        field.mask(mask.apply({}, arguments), options);
    },
    translation: {
        'H': { pattern: /[0-2]/, optional: false },
        'Z': { pattern: /[0-3]/, optional: false },
        'M': { pattern: /[0-5]/, optional: false }
    }
};

$(".horariomask").mask(mask, pattern);

$(document).ready(function () {
    $.ajax({
        url: '/horario',
        dataType: 'json',
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            console.log(data)
            let seg = [], ter = [], qua = [], qui = [], sex = [], sab = [], dom = [], tdnum = 2, i = 0;
            if (data == null) {
            }
            let elements = data;
                let segunda = JSON.parse(elements.segunda);
                segunda.forEach(segunda => {
                    seg.push(segunda)
                    $('.segunda td:nth-child(' + tdnum++ + ') input').val(seg[i++])
                })
                tdnum = 2;
                i = 0;
                let terca = JSON.parse(elements.terca);
                terca.forEach(terca => {
                    ter.push(terca)
                    $('.terca td:nth-child(' + tdnum++ + ') input').val(ter[i++])
                })
                tdnum = 2;
                i = 0;
                let quarta = JSON.parse(elements.quarta);
                quarta.forEach(quarta => {
                    qua.push(quarta)
                    $('.quarta td:nth-child(' + tdnum++ + ') input').val(qua[i++])
                })
                tdnum = 2;
                i = 0;
                let quinta = JSON.parse(elements.quinta);
                quinta.forEach(quinta => {
                    qui.push(quinta)
                    $('.quinta td:nth-child(' + tdnum++ + ') input').val(qui[i++])
                })
                tdnum = 2;
                i = 0;
                let sexta = JSON.parse(elements.sexta);
                sexta.forEach(sexta => {
                    sex.push(sexta)
                    $('.sexta td:nth-child(' + tdnum++ + ') input').val(sex[i++])
                })
                tdnum = 2;
                i = 0;
                let sabado = JSON.parse(elements.sabado);
                sabado.forEach(sabado => {
                    sab.push(sabado)
                    $('.sabado td:nth-child(' + tdnum++ + ') input').val(sab[i++])
                })
                tdnum = 2;
                i = 0;
                let domingo = JSON.parse(elements.domingo);
                domingo.forEach(domingo => {
                    dom.push(domingo)
                    $('.domingo td:nth-child(' + tdnum++ + ') input').val(dom[i++])
                })

            
            $('.divLoader').css('display', 'none')

            $('#tblHr > tbody').find('input').not('input[name=seginp1], input[name=terinp1], input[name=quainp1], input[name=quiinp1], input[name=sexinp1], input[name=sabinp1],input[name=dominp1]').each(function () {
                if ($(this).val().length >= 5) {
                    $(this).css('background-color', 'white').removeAttr('disabled', 'disabled').css('color', 'black')
                    $(this).parent().next().children().removeAttr('disabled', 'disabled').css('color', 'black')
                } else {
                    $(this).not(':last').css('background-color', 'purple').attr('disabled', 'disabled').css('color', 'white').val('Indisp')
                }
            })
            $('#tblHr tbody tr').find('.horariomask').each(function () {
                $(this).val() == "Indisp" ? $(this).css('background-color', 'purple').css('color', 'white').attr('disabled', 'disabled') : null;
                $(this).val() == "" || $(this).val().length <= 0 ? $(this).css('background-color', 'white').css('color', 'black') : null;
            })
            $('#tblHr tbody tr').find('.horariomask').each(function () {
                $(this).attr('placeholder') == "Até" && $(this).val() >= 5 ? $(this).parent().next().children().removeAttr('disabled', 'disabled').css('color', 'black').css('background-color', 'white').css('border', '2px solid purple') : null;
            })
            $('#tblHr tbody tr').each(function (index) {
                $(this).find('.horariomask:first').css('background-color', 'white')
            })
        }
    });
    $('.tooltipped').tooltip();
})