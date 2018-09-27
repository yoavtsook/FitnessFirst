WIDTH = 1400
HEIGHT = 1000
import cv2
import numpy as np
import math
import argparse
import imutils
from PIL import ImageFont, ImageDraw, Image

cscObj = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')
font = ImageFont.truetype("arial.ttf", 30)
textFontGoodWork = ImageFont.truetype("arial.ttf", 60)
textFontWrongHeight = ImageFont.truetype("arial.ttf", 35)
textFontWrongAngle = ImageFont.truetype("arial.ttf", 35)

# def staticAnalyzing(img):
#     resized_image = cv2.resize(img, (900, 700))
#     gray = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)
#     points = cscObj.detectMultiScale(img, scaleFactor=1.1, minNeighbors=3,
#                                      minSize=(15, 15))
#     for (x, y, w, h) in points:
#         cv2.rectangle(resized_image, (x, y), (x + w, y + h), (0, 0, 0), 5)
    # mask.save("mask.jpg")
    # cv2.imshow("output", resized_image)
    # cv2.waitKey(0)


def findAngles(left, face, right):
    leftToFaceSize = math.hypot(left[0] - face[0], left[1] - face[1])
    rightToFaceSize = math.hypot(right[0] - face[0], right[1] - face[1])
    rightToLeftSize = math.hypot(right[0] - left[0], right[1] - left[1])
    leftAngle = np.rad2deg(np.arccos((leftToFaceSize ** 2 +
                                      rightToLeftSize ** 2 -
                                      rightToFaceSize ** 2) / (
                                         2 * leftToFaceSize * rightToLeftSize))) // 1
    rightAngle = np.rad2deg(np.arccos((rightToFaceSize ** 2 +
                                       rightToLeftSize ** 2 -
                                       leftToFaceSize ** 2) / (
                                          2 * rightToFaceSize * rightToLeftSize))) // 1
    topAngle = 180 - leftAngle - rightAngle
    return leftAngle, rightAngle, topAngle


def findweights(mask, colFace, rowFace, img):
    listOfPoints = []
    height = mask.shape[0]
    width = mask.shape[1]
    # TODO not right points
    for i in range(math.ceil(height / 30)):
        top = i * 30
        bottom = min((i + 1) * 30, height)
        for j in range(math.ceil(width / 30)):
            left = j * 30
            right = min((j + 1) * 30, width)
            if (cv2.countNonZero(mask[top:bottom, left:right]) > 60):
                listOfPoints.append(( (top + bottom) // 2, (left + right) //
                                      2))
    leftWeightCandidates = [n for n in listOfPoints if (colFace > n[1])]
    rightWeightCandidates = [n for n in listOfPoints if (colFace < n[1])]
    if (len(leftWeightCandidates) == 0 or len(rightWeightCandidates) == 0):
        return -1
    leftWeight = min(leftWeightCandidates,
                     key=lambda t: math.hypot(colFace - t[1], rowFace - t[0]))
    rightWeight = min(rightWeightCandidates,
                      key=lambda t: math.hypot(colFace - t[1],
                                               rowFace - t[0]))
    return leftWeight, rightWeight

def weights(img):
    points = cscObj.detectMultiScale(img, scaleFactor=1.1, minNeighbors=3,
                                     minSize=(15, 15))
    face = None
    for (x, y, w, h) in points:
        # cv2.rectangle(img,(x,y), (x+w,y+h), (0,0,0), 5)
        face = ( (2 * y + h) // 2,(2 * x + w) // 2)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower_red = np.array([110, 50, 50])
    upper_red = np.array([130, 255, 255])

    # Here we are defining range of bluecolor in HSV
    # This creates a mask of blue colour
    # objects found in the frame.
    mask = cv2.inRange(hsv, lower_red, upper_red)
    # cv2.imshow("output", mask)
    # cv2.waitKey(0)

    weightsLocation = findweights(mask,  face[1], face[0], img)
    if (weightsLocation == -1):
        return -1
    leftWeight, rightWeight = weightsLocation
    leftAngle, rightAngle, topAngle = findAngles((leftWeight[1],leftWeight [0]), (face[1],face[0]),
                                                 (rightWeight[1],rightWeight[0]))
    # cv2.rectangle(img,(centercolFace - wFace,centerrowFace - hFace),
    #               (centercolFace + wFace,centerrowFace + hFace), (0,0,0), 5)
    # cv2.rectangle(img,(leftWeight[0] - 10,leftWeight[1] - 10),
    #               (leftWeight[0] + 10,leftWeight[1] + 10), (0,0,0), 5)
    # cv2.rectangle(img,(rightWeight[0] - 10,rightWeight[1] - 10),
    #               (rightWeight[0] + 10,rightWeight[1] + 10), (0,0,0), 5)
    cv2.line(img, (leftWeight[1],leftWeight [0]), (rightWeight[1],rightWeight[0]),
             (255, 0, 0), 5)
    cv2.line(img, (leftWeight[1],leftWeight [0]), (face[1],face[0]), (255, 0,
                                                                 0), 5)
    cv2.line(img, (rightWeight[1],rightWeight[0]), (face[1],face[0]), (255, 0, 0), 5)
    # cv2.imshow('ss',img)
    # cv2.waitKey(0)
    cv2_im = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    newImg = Image.fromarray(cv2_im)
    draw = ImageDraw.Draw(newImg)
    # font = ImageFont.truetype(<font-file>, <font-size>)
    
    # draw.text((x, y),"Sample Text",(r,g,b))
    draw.text((leftWeight[1] - 25, leftWeight[0] + 25), str(leftAngle),
              (255, 255, 255), font=font)
    draw.text((rightWeight[1] - 25, rightWeight[0] + 25), str(rightAngle),
              (255, 255, 255), font=font)
    if (leftAngle < 22 and rightAngle < 22):
        if(abs(leftWeight[0] - rightWeight[0]) < 50):
            draw.text(
                (rightWeight[1] // 4 + leftWeight[1] * 3 // 4, (rightWeight[0] +
                                                                leftWeight[
                                                                    0]) // 2 +
                 80),
                "Good work", (255, 255, 255),
                font=textFontGoodWork)
        else:
            draw.text(
                (rightWeight[1] // 4 + leftWeight[1] * 3 // 4, (rightWeight[0] +
                                                                leftWeight[
                                                                    0]) // 2 +
                 80),
                "hands must be in the same height", (255, 255, 255),
                font=textFontWrongHeight)
    else:
        draw.text((leftWeight[0] // 2, (rightWeight[1] +
                                        leftWeight[1]) // 2 + 80),
                  "Angle should be lower than 22",
                  (255, 255, 255), font=textFontWrongAngle)

    newImg.save("img1.jpg")


img = cv2.imread("blue.jpg")
if (weights(cv2.resize(img, (900, 700))) == -1):
    print(-1)
    # cv2.imshow("output", img)
    # cv2.waitKey(0)
