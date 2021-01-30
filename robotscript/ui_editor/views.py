import json
from django.shortcuts import render, redirect
from pathlib import Path
import os
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


@csrf_exempt
def index(request):
    # load libraries from local json file
    BASE_DIR = Path(__file__).resolve().parent
    with open(os.path.join(BASE_DIR, "static/ui_editor/json/robot_framework.json"), 'r') as json_file:
        args1 = json.load(json_file)
    with open(os.path.join(BASE_DIR, "static/ui_editor/json/rpa_framework.json"), 'r') as json_file:
        args2 = json.load(json_file)

    args = args2 | args1
    temp = args.copy()
    searchvalue = ''

    if request.method == "POST":
        # load search value
        try:
            data = json.loads(request.body)
            searchvalue = data["body"]
        except:
            print("error detected")

        for k1, v1 in args.items():  # the basic way
            temp = []
            for idx, v2 in enumerate(v1):
                pos = v2['name'].lower().find(searchvalue.lower())
                print(v2['name'], pos, idx)
                if (pos < 0):
                    temp.append(idx)
            temp.reverse()
            for i in temp:
                v1.pop(int(i))

        # render index.html
        return JsonResponse(json.dumps(args), safe=False)

    else:
        # render index.html
        return render(request, "ui_editor/index.html", args)


@csrf_exempt
def save_load(request):
    if request.method == "POST":
        # load search value
        try:
            data = json.loads(request.body)
            lib = data["body"]
        except:
            print("error detected")

        with open('mydata.json', 'w') as file:
            json.dump(lib, file)

        return JsonResponse({"message": "File saved successfully."}, status=201)

    elif request.method == "GET":
        with open('mydata.json', 'r') as file:
            data = json.load(file)

        return JsonResponse(json.dumps(data), safe=False)
