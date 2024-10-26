const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises
let mensagem ="Bem vindo ao app de Metas";


let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json","utf-8")
        metas = JSON.parse(dados)
    }

    catch (erro) {
        metas = []
    }

}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas,null,2))
}

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})

    if(meta.length == 0){
        mensagem = 'A meta não pode ser vazia.'
        return

    }

    metas.push (
        {value: meta, checked:false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if(metas.length == 0 ) {
        mensagem = "Não existem metas!"
        return
    }
    const respostas = await checkbox ({
        message:"Use as setas para mudar de metas, o espaço parar marcar e desmarcar e o Enter para finalizar a etapa",
        choices: [...metas],
        instructions: false,
    })
    
    metas.forEach((m) => {
        m.checked = false

    if(respostas.length == 0){
        mensagem = 'Nenhuma meta selecionada'
    }
})

    respostas.forEach((resposta) =>{
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true

    })

    mensagem = 'Meta(s) marcadas como concluída(s)'

}

const metasRealizadas = async () => {
    if(metas.length == 0 ) {
        mensagem = "Não existem metas!"
        return
    }
    const realizadas = metas.filter ((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log ('Não existe metas realizada(s) D:')
        return
    }

    await select ({
        message: "Metas realizadas:" + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0 ) {
        mensagem = "Não existem metas!"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    
    if (abertas.length == 0 ) {
        console.log ("Não existem metas abertas!:D")
        return
    }
    await select({
        message: "Metas abertas:" + abertas.length,
        choices: [...abertas]

    })
}

const deletarMetas = async () => {
    if(metas.length == 0 ) {
        mensagem = "Não existem metas!"
        return
    }
    const metasDesmarcadas = metas.map ((meta) => {
        return {value: meta.value, checked: false}
    })
    const itemsADeletar = await checkbox ({
        message:"Seleciona item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })
    if (itemsADeletar.length ==0) {
        console.log ("Nenhum item para deletar")
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter ((meta) => {
            return meta.value != item
        })

    })

     mensagem = "Meta(s) deleta(s) com sucesso!"
 
}

const mostrarMensagem = () => {
    console.clear ();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mesnsagem =""
    }
}


const start =async () => {
    await carregarMetas ()
    
    while (true){
        mostrarMensagem ()
        await salvarMetas()
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
                    name:"Metas realizada",
                    value:"realizadas"
                },

                {
                    name:"Metas abertas",
                    value:"abertas"

                },{
                    name:"Deletar metas",
                    value:"deletar"

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
                
                break
            
            case "listar":
                await listarMetas()
                
                break
            
            case "realizadas":
                await metasRealizadas ()
                break
            case "abertas":
                await metasAbertas  ()
                break
            case "deletar":
                await deletarMetas ()
                break
            case "sair":
                console.log("Até a próxima!")
                return
            
    
    
        }
    }
}
 
start()