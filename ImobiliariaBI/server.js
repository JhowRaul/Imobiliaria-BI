'use strict'

var http = require('http').createServer(webServer),
    fs = require('fs'),
    querystring = require('querystring'),
    util = require('util'),
    mysql = require('mysql'),
    objJson = '',
    connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        database: 'imobiliariabi',
        user: 'usuarioteste',
        password: '12345'
    }),
    idCategoriaBanco,
    idTempoBanco,
    idEstadoBanco,
    idCidadeBanco,
    idBairroBanco,
    idProprietarioBanco,
    idFatoBanco,
    faixaSalario = null,
    faixaFilhos = null,
    sexo = null,
    classeSocial = null,
    proprietarioProfissao,
    proprietarioDeficiente,
    cidadeExiste = null,
    bairroExiste = null,
    situacao = null,
    faixa_area_total = null,
    area_privativa = null,
    faixa_iptu = null,
    condominio = null,
    planta = null,
    dependencia = null,
    sacada = null,
    portaria = null,
    elevador = null,
    churrasqueira = null,
    dormitorios = null,
    suites = null,
    vagas = null,
    banheiros = null,
    complemento = null,
    faixa_valor_venda = null,
    faixa_valor_aluguel = null;

function webServer(req, res) {
    if (req.method == 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        res.end(fs.readFileSync('index.html'))
    }

    if (req.method == 'POST') {
        req.on('data', function (data) {
                console.log('\nNova requisição ----------------------------------------------------\n');

                idCategoriaBanco = null;
                idTempoBanco = null;
                idEstadoBanco = null;
                idCidadeBanco = null;
                idBairroBanco = null;
                idProprietarioBanco = null;
                faixaSalario = null;
                faixaFilhos = null;
                sexo = null;
                classeSocial = null;
                proprietarioProfissao = null;
                proprietarioDeficiente = null;
                cidadeExiste = null;
                bairroExiste = null;
                situacao = null;
                faixa_area_total = null;
                area_privativa = null;
                faixa_iptu = null;
                condominio = null;
                planta = null;
                dependencia = null;
                sacada = null;
                portaria = null;
                elevador = null;
                churrasqueira = null;
                dormitorios = null;
                suites = null;
                vagas = null;
                banheiros = null;
                complemento = null;
                faixa_valor_venda = null;
                faixa_valor_aluguel = null;

                objJson = JSON.parse(data);



                // Popular dados no banco ImobiliariaBI start                       
                processarCategoria(objJson.objeto);
                processarTempo(objJson.objeto);
                processarEstado(objJson.objeto);


                function processarCategoria(atualObjeto) {

                    if (atualObjeto.categoria != null && atualObjeto.categoria != "undefined") {
                        var categoria = atualObjeto.categoria;
                        var categoriaExiste = null;

                        // Select para verificar se categoria já existe no banco de dados
                        connection.query(`SELECT * FROM CATEGORIA WHERE DESCRICAO = '${categoria}' ORDER BY ID_CATEGORIA ASC LIMIT 1`, function (err, rows) {
                            if (err != null) {
                                console.log("erro: " + err)
                                res.end("Query error:" + err)
                            } else {
                                for (var c in rows) {
                                    idCategoriaBanco = rows[0].ID_CATEGORIA;
                                    categoriaExiste = rows[0].DESCRICAO;
                                }

                                if (categoriaExiste != null) {
                                    console.log('Categoria já existe : ' + categoriaExiste + ' ' + idCategoriaBanco);
                                } else {
                                    salvarCategoriaNoBanco(categoria);
                                }
                            }
                        });
                    }

                }

                function processarTempo(atualObjeto) {

                    if (atualObjeto.dataConstrucao != null && atualObjeto.dataConstrucao != "undefined") {
                        var dataConstrucao = atualObjeto.dataConstrucao;
                        var tempoExiste = null;

                        // Select para verificar se categoria já existe no banco de dados
                        connection.query(`SELECT * FROM TEMPO WHERE ANO_CONSTRUCAO = '${dataConstrucao}' ORDER BY ID_TEMPO ASC LIMIT 1`, function (err, rows) {
                            if (err != null) {
                                console.log("erro: " + err)
                                res.end("Query error:" + err)
                            } else {
                                for (var c in rows) {
                                    idTempoBanco = rows[0].ID_TEMPO;
                                    tempoExiste = rows[0].ANO_CONSTRUCAO;
                                }

                                if (tempoExiste != null) {
                                    console.log('\nTempo já existe : ' + idTempoBanco + ' ' + tempoExiste);
                                } else {
                                    salvarTempoNoBanco(dataConstrucao);
                                }
                            }
                        });
                    }
                }

                function processarEstado(atualObjeto) {

                    if (atualObjeto.uf != null && atualObjeto.uf != "undefined") {
                        var uf = atualObjeto.uf;
                        var estadoExiste = null;

                        // Select para verificar se categoria já existe no banco de dados
                        connection.query(`SELECT * FROM ESTADO WHERE UF = '${uf}' ORDER BY ID_ESTADO ASC LIMIT 1`, function (err, rows) {
                            if (err != null) {
                                console.log("erro: " + err)
                                res.end("Query error:" + err)
                            } else {
                                for (var c in rows) {
                                    idEstadoBanco = rows[0].ID_ESTADO;
                                    estadoExiste = rows[0].UF;

                                    processarCidade(atualObjeto, rows[0].ID_ESTADO);
                                }

                                if (estadoExiste != null) {
                                    console.log('\nEstado já existe : ' + estadoExiste + idEstadoBanco);
                                } else {
                                    salvarEstadoNoBanco(uf);
                                }
                            }
                        });
                    }
                }

                function processarCidade(atualObjeto, idEstadoBanco) {

                    if (atualObjeto.cidade != null && atualObjeto.cidade != "undefined" && idEstadoBanco != null && idEstadoBanco != "undefined") {
                        var cidade = atualObjeto.cidade;

                        // Select para verificar se categoria já existe no banco de dados
                        connection.query(`SELECT * FROM CIDADE WHERE DESCRICAO = '${cidade}' AND ID_ESTADO = '${idEstadoBanco}'`, function (err, rows) {
                            if (err != null) {
                                console.log("erro: " + err)
                                res.end("Query error:" + err)
                            } else {
                                for (var c in rows) {
                                    idCidadeBanco = rows[0].ID_CIDADE;
                                    cidadeExiste = rows[0].DESCRICAO;

                                    processarBairro(atualObjeto, idCidadeBanco);
                                }

                                if (cidadeExiste != null) {
                                    console.log('\nCidade já existe : ' + cidadeExiste + idCidadeBanco);
                                } else {
                                    salvarCidadeNoBanco(cidade, idEstadoBanco);
                                }
                            }
                        });
                    }
                }

                function processarBairro(atualObjeto, idCidadeBanco) {

                    if (atualObjeto.bairro != null && atualObjeto.bairro != "undefined" && idCidadeBanco != null && idCidadeBanco != "undefined") {
                        var bairro = atualObjeto.bairro;

                        // Select para verificar se categoria já existe no banco de dados
                        connection.query(`SELECT * FROM BAIRRO WHERE DESCRICAO = '${bairro}' AND ID_CIDADE = '${idCidadeBanco}'`, function (err, rows) {
                            if (err != null) {
                                console.log("erro: " + err)
                                res.end("Query error:" + err)
                            } else {
                                for (var c in rows) {
                                    idBairroBanco = rows[0].ID_BAIRRO;
                                    idCidadeBanco = rows[0].ID_CIDADE;
                                    bairroExiste = rows[0].DESCRICAO;

                                    processarProprietario(atualObjeto, idBairroBanco);
                                }

                                if (bairroExiste != null) {
                                    console.log('\nbairro já existe : ' + bairroExiste + idBairroBanco);
                                } else {
                                    salvarBairroNoBanco(bairro, idCidadeBanco);
                                }
                            }
                        });
                    }
                }

                function processarProprietario(atualObjeto, idBairroBanco) {

                    if ((atualObjeto.proprietarioProfissao != null && atualObjeto.proprietarioProfissao != "undefined") || (atualObjeto.proprietarioDeficiente != null && tualObjeto.proprietarioDeficiente != "undefined") || (atualObjeto.proprietarioSalario != null && tualObjeto.proprietarioSalario != "undefined") || (atualObjeto.proprietarioFilhos != null && tualObjeto.proprietarioFilhos != "undefined") || (atualObjeto.proprietarioSexo != null && tualObjeto.proprietarioSexo != "undefined")) {

                        faixaSalario = null;
                        faixaFilhos = null;
                        sexo = null;
                        classeSocial = null;
                        proprietarioProfissao = atualObjeto.proprietarioProfissao;
                        proprietarioDeficiente = atualObjeto.proprietarioDeficiente;

                        var proprietarioSalarioObs = atualObjeto.proprietarioSalario;
                        var proprietarioFilhosObs = atualObjeto.proprietarioFilhos;
                        var proprietarioSexoObs = atualObjeto.proprietarioSexo;
                        var proprietarioClasseSocialObs = atualObjeto.proprietarioClasse_social;

                        if (proprietarioSalarioObs <= 2000) {
                            faixaSalario = 1;
                        } else if (proprietarioSalarioObs > 2000 && proprietarioSalarioObs <= 5000) {
                            faixaSalario = 2;
                        } else if (proprietarioSalarioObs > 5000) {
                            faixaSalario = 3;
                        } else {
                            faixaSalario = 4;
                        }

                        if (proprietarioFilhosObs <= 3) {
                            faixaFilhos = 1;
                        } else if (proprietarioFilhosObs > 3 && proprietarioFilhosObs <= 5) {
                            faixaFilhos = 2;
                        } else if (proprietarioFilhosObs > 5) {
                            faixaFilhos = 3;
                        }

                        if (proprietarioSexoObs == "F" || proprietarioSexoObs == "Feminino") {
                            sexo = 1;
                        } else if (proprietarioSexoObs == "M" || proprietarioSexoObs == "Masculino") {
                            sexo = 2;
                        }

                        if (proprietarioClasseSocialObs == "Baixa") {
                            classeSocial = 1;
                        } else if (proprietarioClasseSocialObs == "Media") {
                            classeSocial = 2;
                        } else if (proprietarioClasseSocialObs == "Alta") {
                            classeSocial = 3;
                        }

                        salvarProprietarioNoBanco(faixaSalario, faixaFilhos, sexo, classeSocial, proprietarioProfissao, proprietarioDeficiente, idBairroBanco);
                    } else {
                        processarFato(idProprietarioBanco, idBairroBanco);
                    }
                }

                function processarFato(idProprietarioBanco, idBairroBanco) {
                    console.log("\nChegou no fato! :D\n\n");

                    console.log("Proprietario: " + idProprietarioBanco);
                    console.log("Bairro: " + idBairroBanco);
                    console.log("Tempo: " + idTempoBanco);
                    console.log("Categoria: " + idCategoriaBanco);                    

                    if (objJson.objeto.status == "ALUGUEL E VENDA") {
                        situacao = 1;
                    } else if (objJson.objeto.status == "ALUGUEL") {
                        situacao = 2;
                    } else if (objJson.objeto.status == "VENDA") {
                        situacao = 3;
                    } else if (objJson.objeto.status == "ALUGADA") {
                        situacao = 4;
                    }

                    if (objJson.objeto.area_total <= 50) {
                        faixa_area_total = 1;
                    } else if (objJson.objeto.area_total >= 51 && objJson.objeto.area_total <= 150) {
                        faixa_area_total = 2;
                    } else if (objJson.objeto.area_total >= 151 && objJson.objeto.area_total <= 300) {
                        faixa_area_total = 3;
                    } else if (objJson.objeto.area_total >= 301) {
                        faixa_area_total = 4;
                    }
                    
                    if (objJson.objeto.area_privativa <= 50) {
                        area_privativa = 1;
                    } else if (objJson.objeto.area_privativa >= 51 && objJson.objeto.area_privativa <= 150) {
                        area_privativa = 2;
                    } else if (objJson.objeto.area_privativa >= 151 && objJson.objeto.area_privativa <= 300) {
                        area_privativa = 3;
                    } else if (objJson.objeto.area_privativa >= 301) {
                        area_privativa = 4;
                    }
                    
                    if (objJson.objeto.iptu <= 50) {
                        faixa_iptu = 1;
                    } else if (objJson.objeto.iptu >= 51 && objJson.objeto.iptu <= 150) {
                        faixa_iptu = 2;
                    } else if (objJson.objeto.iptu >= 151 && objJson.objeto.iptu <= 300) {
                        faixa_iptu = 3;
                    } else if (objJson.objeto.iptu >= 301) {
                        faixa_iptu = 4;
                    }
                    
                    if (objJson.objeto.condominio <= 50) {
                        condominio = 1;
                    } else if (objJson.objeto.condominio >= 51 && objJson.objeto.condominio <= 150) {
                        condominio = 2;
                    } else if (objJson.objeto.condominio >= 151 && objJson.objeto.condominio <= 300) {
                        condominio = 3;
                    } else if (objJson.objeto.condominio >= 301) {
                        condominio = 4;
                    }
                                        
                    if (objJson.objeto.planta == "SIM") {
                        planta = 1;
                    } else if (objJson.objeto.planta == "NAO") {
                        planta = 2;
                    }
                    
                    if (objJson.objeto.dependencia == "SIM") {
                        dependencia = 1;
                    } else if (objJson.objeto.dependencia == "NAO") {
                        dependencia = 2;
                    }
                    
                    if (objJson.objeto.sacada == "SIM") {
                        sacada = 1;
                    } else if (objJson.objeto.sacada == "NAO") {
                        sacada = 2;
                    }
                    
                    if (objJson.objeto.portaria == "SIM") {
                        portaria = 1;
                    } else if (objJson.objeto.portaria == "NAO") {
                        portaria = 2;
                    }
                    
                    if (objJson.objeto.elevador == "SIM") {
                        elevador = 1;
                    } else if (objJson.objeto.elevador == "NAO") {
                        elevador = 2;
                    }
                    
                    if (objJson.objeto.churrasqueira == "SIM") {
                        churrasqueira = 1;
                    } else if (objJson.objeto.churrasqueira == "NAO") {
                        churrasqueira = 2;
                    } else if (objJson.objeto.churrasqueira == "PRIVATIVA") {
                        churrasqueira = 3;
                    }
                    
                    if (objJson.objeto.dormitorios <= 1) {
                        dormitorios = 1;
                    } else if (objJson.objeto.dormitorios == 2) {
                        dormitorios = 2;
                    } else if (objJson.objeto.dormitorios == 3) {
                        dormitorios = 3;
                    } else if (objJson.objeto.dormitorios >= 4) {
                        dormitorios = 4;
                    }
                    
                    if (objJson.objeto.suites <= 1) {
                        suites = 1;
                    } else if (objJson.objeto.suites == 2) {
                        suites = 2;
                    } else if (objJson.objeto.suites == 3) {
                        suites = 3;
                    } else if (objJson.objeto.suites >= 4) {
                        suites = 4;
                    }
                    
                    if (objJson.objeto.vagas <= 1) {
                        vagas = 1;
                    } else if (objJson.objeto.vagas == 2) {
                        vagas = 2;
                    } else if (objJson.objeto.vagas == 3) {
                        vagas = 3;
                    } else if (objJson.objeto.vagas >= 4) {
                        vagas = 4;
                    }
                    
                    if (objJson.objeto.banheiros <= 1) {
                        banheiros = 1;
                    } else if (objJson.objeto.banheiros == 2) {
                        banheiros = 2;
                    } else if (objJson.objeto.banheiros == 3) {
                        banheiros = 3;
                    } else if (objJson.objeto.banheiros >= 4) {
                        banheiros = 4;
                    }
                    
                    if (objJson.objeto.complemento == "Ap") {
                        complemento = 1;
                    } else if (objJson.objeto.complemento == "Casa") {
                        complemento = 2;
                    } else if (objJson.objeto.complemento == "Sobrado") {
                        complemento = 3;
                    } else if (objJson.objeto.complemento == "Terreno") {
                        complemento = 4;
                    }
                    
                    if (objJson.objeto.valor_venda <= 20000) {
                        faixa_valor_venda = 1;
                    } else if (objJson.objeto.valor_venda >= 20001 && objJson.objeto.valor_venda <= 50000) {
                        faixa_valor_venda = 2;
                    } else if (objJson.objeto.valor_venda >= 50001 && objJson.objeto.valor_venda <= 100000) {
                        faixa_valor_venda = 3;
                    } else if (objJson.objeto.valor_venda >= 100001) {
                        faixa_valor_venda = 4;
                    }                 
                    
                    if (objJson.objeto.valor_aluguel <= 500) {
                        faixa_valor_aluguel = 1;
                    } else if (objJson.objeto.valor_aluguel >= 501 && objJson.objeto.valor_aluguel <= 1000) {
                        faixa_valor_aluguel = 2;
                    } else if (objJson.objeto.valor_aluguel >= 1001 && objJson.objeto.valor_aluguel <= 2000) {
                        faixa_valor_aluguel = 3;
                    } else if (objJson.objeto.valor_aluguel >= 2001) {
                        faixa_valor_aluguel = 4;
                    }
                    
                    console.log("\n\nSituação: " + situacao + "\nFaixa Area Total: " + faixa_area_total + "\nFaixa Area Privativa: " + area_privativa + "\nFaixa IPTU: " + faixa_iptu + "\nCondominio: " + condominio + "\nPlanta: " + planta + "\nDependencia: " + dependencia + "\nSacada: " + sacada + "\nPortaria: " + portaria + "\nElevador: " + elevador + "\nChurrasqueira: " + churrasqueira + "\nDomitórios: " + dormitorios + "\nSuites: " + suites + "\nVagas: " + vagas + "\nBanheiros: " + banheiros + "\nComplemento: " + complemento + "\nFaixa Valor Venda: " + faixa_valor_venda + "\n\n");
                    
                    salvarFato(idProprietarioBanco, idBairroBanco, idTempoBanco, idCategoriaBanco, situacao, faixa_area_total, area_privativa, faixa_iptu, condominio, planta, dependencia, sacada, portaria, elevador, churrasqueira, dormitorios, suites, vagas, banheiros, complemento, faixa_valor_venda, faixa_valor_aluguel);
                    
                    console.log("\n\nFim\n\n");
                }




                function salvarCategoriaNoBanco(categoria) {
                    var sql = `INSERT INTO categoria(descricao) VALUES ('${categoria}')`;

                    connection.query(sql, function (err, result) {
                        if (err != null) {
                            res.end("Query error:" + err)
                        } else {
                            console.log(sql);
                            idCategoriaBanco = result.insertId;
                        }
                    });
                }

                function salvarTempoNoBanco(tempo) {
                    var sql = `INSERT INTO tempo(ano_construcao) VALUES (${tempo})`;

                    connection.query(sql, function (err, result) {
                        if (err != null) {
                            res.end("Query error:" + err)
                        } else {
                            console.log(sql);
                            idTempoBanco = result.insertId;
                        }
                    });
                }

                function salvarEstadoNoBanco(estado) {
                    var sql = `INSERT INTO estado(uf) VALUES ('${estado}')`;


                    connection.query(sql, function (err, result) {
                        if (err != null) {
                            res.end("Query error:" + err)
                        } else {
                            console.log(sql);
                            idEstadoBanco = result.insertId;
                            processarCidade(objJson.objeto, idEstadoBanco);
                        }
                    });
                }

                function salvarCidadeNoBanco(cidade, idEstadoBanco) {

                    if (idEstadoBanco != null && idEstadoBanco != "undefined" && cidadeExiste == null && idCidadeBanco == null) {
                        var sql = `INSERT INTO cidade(id_estado, descricao) VALUES ('${idEstadoBanco}', '${cidade}')`;

                        connection.query(sql, function (err, result) {
                            if (err != null) {
                                res.end("Query error:" + err)
                            } else {
                                console.log(sql);
                                idCidadeBanco = result.insertId;
                                processarBairro(objJson.objeto, idCidadeBanco);
                            }
                        });
                    }
                }

                function salvarBairroNoBanco(bairro, idCidadeBanco) {

                    if (idCidadeBanco != null && idCidadeBanco != "undefined" && bairroExiste == null && idBairroBanco == null) {
                        var sql = `INSERT INTO bairro(id_cidade, descricao) VALUES ('${idCidadeBanco}', '${bairro}')`;

                        connection.query(sql, function (err, result) {
                            if (err != null) {
                                res.end("Query error:" + err)
                            } else {
                                console.log(sql);
                                idBairroBanco = result.insertId;
                                processarProprietario(objJson.objeto, idBairroBanco);
                            }
                        });
                    }
                }

                function salvarProprietarioNoBanco(faixaSalario, faixaFilhos, sexo, classeSocial, proprietarioProfissao, proprietarioDeficiente, idBairroBanco) {

                    var sql = `INSERT INTO proprietario(faixa_salario, filhos, sexo, classe_social, profissao, deficiente) VALUES ('${faixaSalario}', '${faixaFilhos}', '${sexo}', '${classeSocial}', '${proprietarioProfissao}', '${proprietarioDeficiente}')`;

                    connection.query(sql, function (err, result) {
                        if (err != null) {
                            res.end("Query error:" + err)
                        } else {
                            console.log(sql);
                            idProprietarioBanco = result.insertId;
                            processarFato(idProprietarioBanco, idBairroBanco);
                        }
                    });

                }

                function salvarFato(idProprietarioBanco, idBairroBanco, idTempoBanco, idCategoriaBanco, situacao, faixa_area_total, area_privativa, faixa_iptu, condominio, planta, dependencia, sacada, portaria, elevador, churrasqueira, dormitorios, suites, vagas, banheiros, complemento, faixa_valor_venda, faixa_valor_aluguel) {
                    
                    var sql = `INSERT INTO fato_imovel(ID_PROPRIETARIO, ID_BAIRRO, ID_TEMPO, ID_CATEGORIA, SITUACAO, FAIXA_AREA_TOTAL, AREA_PRIVATIVA, FAIXA_IPTU, CONDOMINIO, PLANTA, SACADA, PORTARIA, ELEVADOR, CHURRASQUEIRA, DORMITORIOS, SUITES, VAGAS_ESTACIONAMENTO, BANHEIROS, COMPLEMENTO, FAIXA_VALOR_VENDA, FAIXA_VALOR_ALUGUEL) VALUES ('${idProprietarioBanco}', '${idBairroBanco}', '${idTempoBanco}', '${idCategoriaBanco}', '${situacao}', '${faixa_area_total}', '${area_privativa}', '${faixa_iptu}', '${condominio}', '${planta}', '${sacada}', '${portaria}', '${elevador}', '${churrasqueira}', '${dormitorios}', '${suites}', '${vagas}', '${banheiros}', '${complemento}', '${faixa_valor_venda}', '${faixa_valor_aluguel}')`;
                    
                    console.log("Dentro do salvarFato: " + sql);

                    connection.query(sql, function (err, result) {
                        if (err != null) {
                            res.end("Query error:" + err)
                        } else {
                            console.log(sql);
                            idFatoBanco = result.insertId;
                            console.log('\nFato: ' + idFatoBanco);
                        }
                    });
                }



                /*     function setEstado(value) {
                         idEstadoBanco = value;
                         console.log("setando estado: " + idEstadoBanco);
                     } */

                //close

            })
            .on('end', function () {
                var response = {
                    status: 200,
                    success: 'Updated Successfully',
                    objeto: idFatoBanco
                }

                res.end(JSON.stringify(response));
            })
    }
}

http.listen(3000)

console.log('Server running at http://localhost:3000/')
