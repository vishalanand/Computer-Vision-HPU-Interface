from flask import Flask, render_template, request
import json, math
import os, sys


app = Flask(__name__)
app.debug = True

SAVE = True

''' HPU Definitions :

    HPU1 - Baseline HPU, human draws boxes without CPU prompts

    HPU2 - human clicks on boxes which are not cars

    HPU3 - human draws boxes around cars not detected by CPU

    HPU4 - human clicks on cars which do not pass the threshold     '''


''' Change the following file paths as needed '''

IMAGE_PATH = "static/imageFun/"          #images have to be in the static folder or a subfolder in static like '/static/images/'

IMAGE_EXTENSION = ".png"                #image file extension with the dot. Generally .jpg, .png or .gif. Do not use .pgm

DATA_EXTENSION = ".dat"

PREFIX = "test-"                  #image name format without identifying digit. For 'test-0.jpg' it will be 'test-'

CONFIDENT_BOXES = "data/confident/"

HPU1_COUNT_FILE = "data/log/hpu1.count"

HPU1_DATA_FILE = "data/log/hpu1.data"

HPU2_COUNT_FILE = "data/log/hpu2.count"

HPU2_DATA_FILE = "data/log/hpu2.data"

HPU3_COUNT_FILE = "data/log/hpu3.count"

HPU3_DATA_FILE = "data/log/hpu3.data"

HPU4_COUNT_FILE = "data/log/hpu4.count"

HPU4_DATA_FILE = "data/log/hpu4.data"

''' If you get FILE I/O errors, check the file paths '''

@app.route('/')
def hpu_html():
    return render_template('hpu.html')

@app.route('/hpu1')
def hpu1_html():
    return render_template('hpu1.html')


@app.route('/hpu2')
def hpu2_html():
    return render_template('hpu2.html')


@app.route('/hpu3')
def hpu3_html():
    return render_template('hpu3.html')


@app.route('/hpu4')
def hpu4_html():
    return render_template('hpu4.html')


@app.route('/hpu1/get')
def hpu1_get():
    #return os.path.dirname(os.path.realpath(__file__))
    #return "static/imageFun/test-24.png"
    #return "1234"

    #with open("data/hpu1.txt", 'r') as file:
    """
    try:
        file_name = os.path.dirname(os.path.realpath(__file__)) + "/"+HPU1_COUNT_FILE
        #return file_name
        f = open(file_name)
        #s = f.readline()
        #i = int(s.strip())
    except IOError as e:
        return "I/O error({0}): {1}".format(e.errno, e.strerror)
    return "Yes!"
    return os.path.dirname(os.path.realpath(__file__))
    return "1234"
    """
    """
    except:
        return "Unexpected error!"+str(sys.exc_info()[0])+"Wow"
        #print "Unexpected error:", sys.exc_info()[0]
        #raise
    """

    file_name = os.path.dirname(os.path.realpath(__file__)) + "/"+HPU1_COUNT_FILE
    with open(file_name, 'r+') as file:

        count = file.read()

        if int(count) < 97:

            new_count = str(int(count) + 1)
            file.seek(0)
            file.truncate()
            file.write(new_count)

            response = IMAGE_PATH + PREFIX + count + IMAGE_EXTENSION

        else:
            response = IMAGE_PATH + "done" + IMAGE_EXTENSION

        return response


@app.route('/hpu2/get')
def hpu2_get():

    response = ""

    file_name = os.path.dirname(os.path.realpath(__file__)) + "/"+HPU2_COUNT_FILE
    with open(file_name, 'r+') as file:

        count = file.read()

        if int(count) < 97:

            new_count = str(int(count) + 1)
            file.seek(0)
            file.truncate()
            file.write(new_count)

            response = IMAGE_PATH + PREFIX + count + IMAGE_EXTENSION

        else:
            response = IMAGE_PATH + "done" + IMAGE_EXTENSION
            #count = count-1

    with open(os.path.dirname(os.path.realpath(__file__)) + "/" + CONFIDENT_BOXES + PREFIX + count + DATA_EXTENSION, 'r') as file:

        data = file.read()

        if data == "":
            return response

        if data[-1] == '\n':
            data = data[:-1]

        lines = data.split('\n')

        data = ""

        for line in lines:
            line = line.split()
            for value in line:
                data += " " + value

        print data

        response += data

    return response


@app.route('/hpu3/get')
def hpu3_get():

    response = ""
    file_name = os.path.dirname(os.path.realpath(__file__)) + "/"+HPU3_COUNT_FILE
    with open(file_name, 'r+') as file:
    #with open(HPU3_COUNT_FILE, 'r+') as file:

        count = file.read()

        if int(count) < 97:

            new_count = str(int(count) + 1)
            file.seek(0)
            file.truncate()
            file.write(new_count)

            response = IMAGE_PATH + PREFIX + count + IMAGE_EXTENSION

        else:
            response = IMAGE_PATH + "done" + IMAGE_EXTENSION

    with open(os.path.dirname(os.path.realpath(__file__)) + "/" + CONFIDENT_BOXES + PREFIX + count + DATA_EXTENSION, 'r') as file:

        data = file.read()

        if data == "":
            return response

        if data[-1] == '\n':
            data = data[:-1]

        lines = data.split('\n')

        data = ""

        for line in lines:
            line = line.split()
            for value in line:
                data += " " + value

        print data

        response += data

    return response


@app.route('/hpu4/get')
def hpu4_get():

    response = ""

    file_name = os.path.dirname(os.path.realpath(__file__)) + "/"+HPU4_COUNT_FILE
    with open(file_name, 'r+') as file:
    #with open(HPU4_COUNT_FILE, 'r+') as file:

        count = file.read()

        if int(count) < 97:

            new_count = str(int(count) + 1)
            file.seek(0)
            file.truncate()
            file.write(new_count)

            response = IMAGE_PATH + PREFIX + count + IMAGE_EXTENSION

        else:
            response = IMAGE_PATH + "done" + IMAGE_EXTENSION

    with open(os.path.dirname(os.path.realpath(__file__)) + "/" + CONFIDENT_BOXES + PREFIX + count + DATA_EXTENSION, 'r') as file:

        data = file.read()

        if data == "":
            return response

        if data[-1] == '\n':
            data = data[:-1]

        lines = data.split('\n')

        data = ""

        for line in lines:
            line = line.split()
            for value in line:
                data += " " + value

        print data

        response += data

    return response

@app.route('/hpu1/save/<data>')
def hpu1_save(data):

    if(SAVE):
        with open(os.path.dirname(os.path.realpath(__file__)) + "/" + HPU1_DATA_FILE, 'a') as file:
            file.write(data + '\n')

    return "lite"


@app.route('/hpu2/save/<data>')
def hpu2_save(data):

    if(SAVE):
        with open(os.path.dirname(os.path.realpath(__file__)) + "/" + HPU2_DATA_FILE, 'a') as file:
            file.write(data + '\n')

    return "lite"


@app.route('/hpu3/save/<data>')
def hpu3_save(data):

    if(SAVE):
        with open(os.path.dirname(os.path.realpath(__file__)) + "/" + HPU3_DATA_FILE, 'a') as file:
            file.write(data + '\n')

    return "lite"


@app.route('/hpu4/save/<data>')
def hpu4_save(data):

    if(SAVE):
        with open(os.path.dirname(os.path.realpath(__file__)) + "/" + HPU4_DATA_FILE, 'a') as file:
            file.write(data + '\n')

    return "lite"

if __name__ == '__main__':
    app.run(host='0.0.0.0')
