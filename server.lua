ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)


ESX.RegisterServerCallback("light-mdt:getData", function(source, cb)
    data = {}

    exports.ghmattimysql:execute("SELECT * FROM users", {
    }, function(result1)

        for i = 1, #result1, 1 do
            result1[i].bank = json.decode(result1[i].accounts).bank
        end

        exports.ghmattimysql:execute("SELECT * FROM owned_vehicles", {
        }, function(result2)
            exports.ghmattimysql:execute("SELECT * FROM mdt_tutanaklar", {
            }, function(result3)

                for i = 1, #result3, 1 do
                    result3[i].polisler = json.decode(result3[i].polisler)
                    result3[i].suclular = json.decode(result3[i].suclular)
                    result3[i].cezalar = json.decode(result3[i].cezalar)
                end

                table.insert(data, {
                    oyuncular = result1,
                    araclar = result2,
                    tutanaklar = result3
                })
                cb(data)
            end)
        end)
    end)
end)

RegisterServerEvent("light-mdt:saveReport")
AddEventHandler("light-mdt:saveReport", function(data)
    exports['ghmattimysql']:execute("INSERT INTO mdt_tutanaklar ( description, suclular, polisler, cezalar) VALUES (@desc, @suclular, @polisler, @cezalar)", {
        ['@desc'] = tostring(data.desc),
        ['@suclular'] = json.encode(data.crim),
        ['@polisler'] = json.encode(data.cops),
        ['@cezalar'] = json.encode(data.ceza)

    }, function(data)
        print(json.encode(data))
    end)
    TriggerClientEvent("light-mdt:updateMDT", source, "tutanaklar")
end)

RegisterServerEvent("light-mdt:setPP")
AddEventHandler("light-mdt:setPP", function(data)
    print(json.encode(data))

    exports["ghmattimysql"]:execute("UPDATE users SET mdt_img = @mdt_img WHERE id = @id", {
        ["@id"] = data.playerid,
        ["@mdt_img"] = data.url
    })
end)

RegisterServerEvent("light-mdt:deleteTutanak")
AddEventHandler("light-mdt:deleteTutanak", function(data)
    print(data.tutanak_id)
    exports["ghmattimysql"]:execute("DELETE FROM mdt_tutanaklar WHERE id = @id", {
        ["@id"] = data.tutanak_id,
    })
    TriggerClientEvent("light-mdt:updateMDT", source, "tutanaklar")
end)

RegisterServerEvent("light-mdt:setAraniyor")
AddEventHandler("light-mdt:setAraniyor", function(data)
    print(json.encode(data))

    print(data.araniyorid)

    exports["ghmattimysql"]:execute("UPDATE users SET araniyor = @araniyor WHERE id = @id", {
        ["@id"] = data.playerid,
        ["@araniyor"] = data.araniyorid
    })
    TriggerClientEvent("light-mdt:updateMDT", source, "arananlar")

end)



