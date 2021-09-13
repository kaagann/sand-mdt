ESX = nil
isOpen = false

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
end)

RegisterCommand("mdt", function() TriggerEvent("light-mdt:displayMDT") end)

RegisterNetEvent('light-mdt:displayMDT')
AddEventHandler('light-mdt:displayMDT', function()
    SendNUIMessage({
        action = "displayMDT"
    })

    if isOpen == true then 
        isOpen = false 
    else
        ESX.TriggerServerCallback("light-mdt:getData", function(data) 
            SendNUIMessage({
                action = "mdtData",
                bilgiler = data
            })
        end)
        isOpen = true
    end
    SetNuiFocus(isOpen, isOpen)
end)

RegisterNUICallback("closeMDT", function()
    TriggerEvent("light-mdt:displayMDT")
end)

RegisterNUICallback("saveReport", function(data)
    TriggerServerEvent("light-mdt:saveReport", data)
end)

RegisterNUICallback("setPP", function(data)
    TriggerServerEvent("light-mdt:setPP", data)
end)

RegisterNUICallback("deleteTutanak", function(data)
    TriggerServerEvent("light-mdt:deleteTutanak", data)
end)

RegisterNUICallback("setAraniyor", function(data)
    TriggerServerEvent("light-mdt:setAraniyor", data)
end)

RegisterNUICallback("openEvidence", function(data)
    TriggerServerEvent("inventory:server:OpenInventory", "stash", "Motel"..data.id)
    TriggerEvent("inventory:client:SetCurrentStash","Motel"..data.id)
end)

RegisterNetEvent("light-mdt:updateMDT")
AddEventHandler("light-mdt:updateMDT", function(param)
    ESX.TriggerServerCallback("light-mdt:getData", function(data) 
        SendNUIMessage({
            action = "updateData",
            bilgiler = data,
            type = param
        })
    end)
end)

RegisterNUICallback('take-photo', function(data, cb)
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    takePhoto = true
    SetNuiFocus(false, false)

    while takePhoto do
        Citizen.Wait(0)

        if IsControlJustPressed(1, 27) then -- Toogle Mode
            frontCam = not frontCam
            CellFrontCamActivate(frontCam)
            
        elseif IsControlJustPressed(1, 177) then -- CANCEL
            DestroyMobilePhone()
            CellCamActivate(false, false)
            cb("")
            takePhoto = false
            SetNuiFocus(true, true)
            break
        elseif IsControlJustPressed(1, 176) then -- TAKE.. PIC
            exports['screenshot-basic']:requestScreenshotUpload(Config.webhook, "files[]", function(data)
            local resp = json.decode(data)
            DestroyMobilePhone()
            CellCamActivate(false, false)
            SetNuiFocus(true, true)
            cb(resp.attachments[1].proxy_url)
        end)

        takePhoto = false
    end

    HideHudComponentThisFrame(7)
    HideHudComponentThisFrame(8)
    HideHudComponentThisFrame(9)
    HideHudComponentThisFrame(6)
    HideHudComponentThisFrame(19)
    HideHudAndRadarThisFrame()
  end
end)