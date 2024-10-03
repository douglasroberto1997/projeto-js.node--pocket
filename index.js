const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [meta]
const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})

    if(meta.length == 0){
        console.log('A meta não pode ser vazia.')
        return

    }

    metas.push (
        {value: meta, checked:false}
    )
}

const listarMetas = async () => {
    const respostas = await checkbox ({
        message:"Use as setas para mudar de metas, o espaço parar marcar e desmarcar e o Enter para finalizar a etapa",
        choices: [...metas],
        instructions: false,
    })
    
    metas.forEach((m) => {
        m.checked = false

    
    
    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada")
        return
    }

    

})

    respostas.forEach((resposta) =>{
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true

    })

    console.log ('Meta(s) marcadas como concluída(s)')

}

const metasRealizadas = async () => {
    const realizadas = metas.filter ((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log ('Não existe metas realizada(s) D:')
        return
    }

    await select ({
        message: "Metas realizadas",
        choices: [...realizadas]
    })

    console.log (realizadas)
}


const start =async () => {
    
    while (true){

        const opcao = await select ({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name:"Listar metas",
                    value:"listar"

                },
                {
                    name:"Metas realizadas",
                    value:"realizadas"

                },
                {
                    name: "sair",
                    value: "sair"

                }
            ]
        })

        
        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
            break
            case "listar":
                await listarMetas()
            
            break
            case "realizadas":
                await metasRealizadas ()
                break
            case "sair":
                console.log("Até a próxima!")
                return
            
    
    
        }
    }
}
 
start()