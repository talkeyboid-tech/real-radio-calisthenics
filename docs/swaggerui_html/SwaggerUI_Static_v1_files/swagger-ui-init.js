
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "ラジオ体操動画API",
      "version": "1.0.0",
      "description": "全国各地のラジオ体操をやってみよう！",
      "contact": {
        "name": "Yoshihiro Maeda",
        "email": "yoshihiro.maeda.cc@gmail.com"
      }
    },
    "servers": [
      {
        "url": "http://localhost:3000"
      }
    ],
    "paths": {
      "/videos": {
        "get": {
          "tags": [
            "videos"
          ],
          "summary": "ラジオ体操動画情報一覧取得",
          "description": "ラジオ動画情報一覧を取得する。\n\nクエリパラメータ\n\n - 指定なし: 全件取得\n\n- 指定あり: AND条件で実行",
          "parameters": [
            {
              "in": "query",
              "name": "limit",
              "description": "limit",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "offset",
              "description": "offset（指定した次の要素から）",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "random",
              "description": "ランダムに動画を取得",
              "schema": {
                "type": "string",
                "enum": [
                  true
                ]
              }
            },
            {
              "in": "query",
              "name": "id",
              "description": "動画ID（完全一致）",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "title",
              "description": "動画タイトル（部分一致）",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "description",
              "description": "動画概要説明（部分一致）",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "view_count_gt",
              "description": "再生回数（以上）",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "view_count_lt",
              "description": "再生回数（未満）",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "like_count_gt",
              "description": "高評価数（以上）",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "like_count_lt",
              "description": "高評価数（未満）",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "成功時",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Video"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "失敗時: 動画IDが見つからない",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "example": []
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "videos"
          ],
          "summary": "ラジオ体操動画情報追加",
          "description": "ラジオ体操動画情報を追加する",
          "required": true,
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Video"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "成功時",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "properties": {
                        "url": {
                          "type": "string"
                        }
                      }
                    },
                    "example": [
                      {
                        "url": "http://localhost:3000/videos/feSVtC1BSeQ"
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "description": "項目エラー",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ValidationError"
                  },
                  "examples": {
                    "必須項目エラー": {
                      "value": {
                        "message": "必須項目がありません",
                        "required": "title"
                      }
                    },
                    "不正項目エラー": {
                      "value": {
                        "message": "不正な項目が含まれています",
                        "invalid": "abcdefg"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/videos/{id}": {
        "get": {
          "tags": [
            "videos"
          ],
          "summary": "ラジオ体操動画情報取得",
          "description": "動画IDを指定しラジオ動画情報を取得する",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "成功時",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Video"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "失敗時: 動画IDが見つからない",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "example": []
                  }
                }
              }
            }
          }
        },
        "patch": {
          "tags": [
            "videos"
          ],
          "summary": "ラジオ体操動画情報編集",
          "description": "動画IDを指定しラジオ動画情報を編集する",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "required": true,
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Video"
                },
                "example": {
                  "title": "新しいタイトル"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "成功時",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "example": {
                      "url": "http://localhost:3000/videos/feSVtC1BSeQ"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "項目エラー",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ValidationError"
                  },
                  "examples": {
                    "必須項目エラー": {
                      "value": {
                        "message": "必須項目がありません",
                        "required": "title"
                      }
                    },
                    "不正項目エラー": {
                      "value": {
                        "message": "不正な項目が含まれています",
                        "invalid": "abcdefg"
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "失敗時: 動画IDが見つからない",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "example": []
                  }
                }
              }
            }
          }
        },
        "delete": {
          "tags": [
            "videos"
          ],
          "summary": "ラジオ体操動画情報削除",
          "description": "動画IDを指定しラジオ動画情報を削除する",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "204": {
              "description": "成功時"
            },
            "404": {
              "description": "失敗時: 動画IDが見つからない",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "example": []
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Video": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "動画ID（Youtube ID）",
              "example": "feSVtC1BSeQ"
            },
            "title": {
              "type": "string",
              "description": "動画タイトル",
              "example": "[テレビ体操] ラジオ体操第1 | NHK"
            },
            "description": {
              "type": "string",
              "description": "動画概要説明",
              "example": "図解をこちらからダウンロードできます！\n「ラジオ体操」図解 https://www4.nhk.or.jp/radio-taisou/23/?cid=dchk-yt-2004-04-st\n誰もが知っている「ラジオ体操第1・第2」。長い間、人々に親しまれてきています。\n年齢や仕事などに関係なく、老若男女どなたでも気軽に行えますので、ぜひ生活の中に取り入れることをおすすめします。\n\n【出演者】\n多胡肇、清水沙希、舘野怜奈、吉江晴菜、矢作あかり、戸塚寛子、幅しげみ（ピアノ）\n\n【放送情報】\nNHK ラジオ第1（月～日）午前 6：30～／ラジオ第2（月～土）午後 0：00～【ラジオ体操】\nNHK 総合（月～金）午後 1：55～／Eテレ（月～日）午前 6：25～【テレビ体操】\nNHK 総合（月～金）午前 9：55～【みんなの体操】\n\nテレビ体操\nhttp://nhk.jp/tv-taisou?cid=dchk-yt-2004-04-hpa\nみんなの体操\nhttp://nhk.jp/minna-taisou?cid=dchk-yt-2004-04-hpb\nラジオ体操\nhttp://nhk.jp/radio-taisou?cid=dchk-yt-2004-04-hpc\n\n体操で気持ち良く体をほぐしていきましょう。年齢や仕事などに関係なく老若男女どなたでも気軽に行えますので、生活の中に取り入れることをおすすめします。"
            },
            "view_count": {
              "type": "number",
              "description": "再生回数",
              "example": 85984798
            },
            "like_count": {
              "type": "number",
              "description": "高評価数",
              "example": 118103
            }
          }
        },
        "ValidationError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "エラーメッセージ",
              "example": "必須項目がありません"
            },
            "required": {
              "type": "string",
              "description": "必須項目",
              "example": "title"
            },
            "invalid": {
              "type": "string",
              "description": "不正な項目",
              "example": "abcdefg"
            }
          }
        }
      }
    },
    "tags": []
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
