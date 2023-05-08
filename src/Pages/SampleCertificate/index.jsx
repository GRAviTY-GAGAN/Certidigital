import { Button, Form, Input, InputNumber, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/sampleCertificate.css";
import { DoubleLeftOutlined } from "@ant-design/icons";

const SampleCertificate = () => {
  let { id } = useParams();
  const authDetails = JSON.parse(localStorage.getItem("authDetails"));
  let token = authDetails?.token;

  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([
    {
      id: 1,
      name: "Name",
      alignment: "center",
      x: 50,
      y: 50,
      width: 450,
      height: 35,
      text: "Saraswati Panda",
      fontSize: 35,
      fontWeight: 600,
      fontColor: "#1F2937",
      fontFamily: "Arial",
    },
  ]);
  const [shapeId, setShapeId] = useState(null);
  const [form] = Form.useForm();
  const [currentShape, setCurrentShape] = useState(null);
  let current_shape_index = null;
  let is_dragging = false;
  let startX;
  let startY;
  const record = JSON.parse(localStorage.getItem("record"));
  const templateHeight = record.height;
  const templateWidth = record.width;
  const [canvasHeight, setCanvasHeight] = useState();
  const [canvasWidth, setCanvasWidth] = useState();
  const [showCsvButton, setshowCsvButton] = useState(true);
  const navigate = useNavigate();

  const addShape = () => {
    setshowCsvButton(true);
    const numShapes = shapes.length;
    const newY = numShapes * 50 + 100;
    setShapes([
      ...shapes,
      {
        id: numShapes + 1,
        name: "",
        alignment: "center",
        x: newY,
        y: newY,
        width: 200,
        height: 50,
        text: `Text Field ${numShapes + 1}`,
        fontSize: 20,
        fontWeight: 600,
        fontColor: "#1F2937",
        fontFamily: "Arial",
      },
    ]);
  };

  const deleteShape = (id) => {
    setShapes(shapes.filter((shape, i) => shape.id !== id));
    setShapeId(null);
  };
  const editShape = (id) => {
    setCurrentShape(null);
    setshowCsvButton(true);
    let selectedShape = shapes.filter((shape, i) => shape.id == id);
    setCurrentShape(selectedShape[0]);
    form.setFieldsValue(selectedShape[0]);
    // setShapeId(null);
  };

  const handleCertificateUpdate = (values) => {
    const newValues = {
      ...values,
      width: Number(values.width),
      height: Number(values.height),
      x: Number(values.x),
      y: Number(values.y),
    };
    // const newShapes = shapes.map((item) =>
    //   item.id === newValues.id ? { ...item, ...newValues } : item
    // );
    const newShapes = shapes.map((item) => {
      if (item.id === newValues.id) {
        const updatedItem = { ...item, ...newValues };
        for (let key in updatedItem) {
          if (
            typeof updatedItem[key] === "string" &&
            !isNaN(updatedItem[key])
          ) {
            updatedItem[key] = Number(updatedItem[key]);
          }
        }
        return updatedItem;
      }
      return item;
    });
    setShapes(newShapes);
    form.resetFields();
    message.success("Field updated successfully");
    setCurrentShape(null);
  };

  // save Feilds API
  const handleFieldsData = (shapes) => {
    let payload = {
      template: id,
      fields: shapes,
      canvasHeight,
      canvasWidth,
    };
    console.log("payload: ", payload);

    fetch("http://localhost:8080/certificate/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data);
        message.success("Template with fields Saved successfully", 1.5);
        setTimeout(() => {
          navigate(`/templateDetail/${id}`);
        }, 1500);
      })
      .catch((err) => {
        console.log("err: ", err);
        message.error("Error saving the fields");
      });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.style.width = "900px";
    canvas.width = canvas.offsetWidth;
    // canvas.style.border = "5px solid black";
    const aspectRatio = templateWidth / templateHeight;
    canvas.height = Math.floor(canvas.width / aspectRatio);
    canvas.style.background = `url(http://localhost:8080/template/singletemplate/${id})`;
    canvas.style.backgroundSize = "cover";
    let canvas_width = canvas.width;
    setCanvasWidth(canvas_width);
    let canvas_height = canvas.height;
    setCanvasHeight(canvas_height);

    let offset_x;
    let offset_y;

    let get_offset = function () {
      let canvas_offset = canvas.getBoundingClientRect();
      offset_x = canvas_offset.left;
      offset_y = canvas_offset.top;
      // let canvas_offset = canvas.getBoundingClientRect();
      // offset_x = canvas_offset.left;
      // offset_y = canvas_offset.top + window.scrollY; // add window.scrollY to offset_y
    };
    get_offset();
    window.onscroll = function () {
      get_offset();
    };
    window.onresize = function () {
      get_offset();
    };
    canvas.onscroll = function () {
      get_offset();
    };

    let is_mouse_in_shape = function (x, y, shape) {
      let shape_left = shape.x;
      let shape_right = shape.x + shape.width;
      let shape_top = shape.y;
      let shape_bottom = shape.y + shape.height + 10;
      if (
        x > shape_left &&
        x < shape_right &&
        y > shape_top &&
        y < shape_bottom
      ) {
        setShapeId(shape.id);
        return true;
      }
      return false;
    };

    let mouse_down = function (event) {
      event.preventDefault();
      startX = parseInt(event.clientX);
      startY = parseInt(event.clientY);
      let index = 0;
      for (let shape of shapes) {
        if (is_mouse_in_shape(startX, startY, shape)) {
          current_shape_index = index;
          setShapeId(shape.id);
          is_dragging = true;
          setCurrentShape(null);
          draw_shapes();
          return;
        }
        index++;
      }
    };

    let mouse_up = function (event) {
      if (!is_dragging) {
        return;
      }
      event.preventDefault();
      is_dragging = false;
      draw_shapes();
    };
    let mouse_out = function (event) {
      if (!is_dragging) {
        return;
      }
      event.preventDefault();
      is_dragging = false;
      draw_shapes();
    };

    let mouse_move = function (event) {
      if (!is_dragging) {
        return;
      } else {
        event.preventDefault();
        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        let current_shape = shapes[current_shape_index];
        current_shape.x += dx;
        current_shape.y += dy;
        draw_shapes();
        startX = mouseX;
        startY = mouseY;
      }
    };
    canvas.onmousedown = mouse_down;
    canvas.onmouseup = mouse_up;
    canvas.onmouseout = mouse_out;
    canvas.onmousemove = mouse_move;

    let draw_shapes = function () {
      context.clearRect(0, 0, canvas_width, canvas_height);
      for (let shape of shapes) {
        context.fillStyle = shape.fontColor;
        context.font = `${shape.fontWeight} ${shape.fontSize}px ${shape.fontFamily}`;
        let textWidth = context.measureText(shape.text).width;
        let textHeight = shape.fontSize;
        shape.height = textHeight;
        if (textWidth > shape.width) {
          shape.width = textWidth + 60;
        }
        let centerX = shape.x + shape.width / 2;
        let centerY = shape.y + shape.height / 2;
        // let centerY = shape.y + shape.height / 2 + window.scrollY;
        context.textBaseline = "middle";
        if (shape.alignment === "center") {
          context.textAlign = "center";
          context.fillText(shape.text, centerX, centerY);
        } else if (shape.alignment === "left") {
          context.textAlign = "left";
          context.fillText(shape.text, shape.x, centerY);
        } else if (shape.alignment === "right") {
          context.textAlign = "right";
          let textX = shape.x + shape.width; // Adjust the x-coordinate to align the text to the right
          let textY = shape.y + shape.height / 2;
          context.fillText(shape.text, textX, textY);
        }
        if (shape.id === shapeId) {
          context.strokeStyle = "grey";
          context.lineWidth = 1;
          context.strokeRect(shape.x, shape.y, shape.width, shape.height);
          // context.strokeRect(
          //   shape.x,
          //   shape.y + window.scrollY,
          //   shape.width,
          //   shape.height
          // ); // add window.scrollY to y-coordinate
          context.fillStyle = "transparent";
          context.fillRect(shape.x, shape.y, shape.width, shape.height);
          // context.fillRect(
          //   shape.x,
          //   shape.y + window.scrollY,
          //   shape.width,
          //   shape.height
          // ); // add window.scrollY to y-coordinate
        }
      }
    };

    draw_shapes();

    canvas.addEventListener("click", function (event) {
      let mouseX = parseInt(event.clientX);
      let mouseY = parseInt(event.clientY);
      let isInsideShape = false;
      for (let shape of shapes) {
        if (is_mouse_in_shape(mouseX, mouseY, shape)) {
          isInsideShape = true;
          break;
        }
      }
      if (!isInsideShape) {
        setShapeId(null);
        draw_shapes();
      }
    });
    return () => {
      canvas.onmousedown = mouse_down;
      canvas.onmouseup = mouse_up;
      canvas.onmouseout = mouse_out;
      canvas.onmousemove = mouse_move;
    };
  }, [shapes, shapeId]);

  return (
    <>
      <div className="sampleCertificateContainer">
        <div className="canvasContainer">
          <canvas ref={canvasRef} />
        </div>
        <div className="sampleCertificateRightBox">
          <div className="submitcsvDiv">
            <Button
              type="primary"
              style={{
                fontWeight: 600,
              }}
              block
              onClick={addShape}
            >
              Add New Field
            </Button>
            <Button
              type="primary"
              block
              style={{
                background: "#1F2937",
                color: "White",
                fontWeight: 600,
              }}
              onClick={() => handleFieldsData(shapes)}
            >
              Save Template
            </Button>
            <Button
              style={{
                fontWeight: 600,
              }}
              onClick={() => navigate(`/sampleTemplate`)}
              icon={<DoubleLeftOutlined />}
            >
              Back
            </Button>
          </div>
          <div>
            <p style={{ color: "gray", textAlign: "left", marginLeft: 10 }}>
              Before saving, please make sure you have added all the required
              fields.
            </p>
          </div>
          <div
            style={{
              background: "white",
              padding: "1px 20px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            {shapes.length > 0 ? (
              <>
                {shapes.map((shape) => (
                  <div key={shape.id}>
                    <h3 style={{ color: "#F94A29" }}>
                      {shape.name}:{" "}
                      <span
                        style={{
                          color: `${shape.fontColor}`,
                          fontWeight: `${shape.fontWeight}`,
                        }}
                      >
                        {shape.text}
                      </span>
                    </h3>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h3>No field added, Please add fields</h3>
              </div>
            )}
          </div>
          {shapeId ? (
            <div>
              <div className="selectedShapeDiv">
                <Button
                  style={{
                    background: "#1F2937",
                    color: "White",
                    fontWeight: 600,
                  }}
                  type="primary"
                  block
                  onClick={() => editShape(shapeId)}
                >
                  Edit Seleted Field
                </Button>
                <Button
                  style={{
                    background: "#F94A29",
                    color: "White",
                    fontWeight: 600,
                  }}
                  type="primary"
                  block
                  onClick={() => deleteShape(shapeId)}
                >
                  Delete Seleted Field
                </Button>
              </div>
              <div>
                {currentShape ? (
                  <Form
                    form={form}
                    labelAlign=""
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleCertificateUpdate}
                    onFinishFailed={(error) => {
                      console.log({ error });
                    }}
                    initialValues={currentShape}
                  >
                    <h3>Edit the Selected Field</h3>
                    <Form.Item name="id" style={{ display: "none" }}>
                      <Input type="hidden" />
                    </Form.Item>
                    <div className="TwoFormItemsDiv">
                      <Form.Item
                        label="X Position"
                        name="x"
                        rules={[
                          {
                            required: true,
                            message: "Please enter X Position",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Y Position"
                        name="y"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Y Position",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>

                      <Form.Item
                        label="Width"
                        name="width"
                        rules={[
                          {
                            required: true,
                            message: "Please enter width",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Height"
                        name="height"
                        rules={[
                          {
                            required: true,
                            message: "Please enter height",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                    </div>
                    <Form.Item
                    // extra="Please give the 'Field Name' same as the csv file field names."
                    >
                      <div
                        className="FieldTextMainDiv"
                        style={{ marginBottom: -20 }}
                      >
                        <div className="FieldNameDiv">
                          <Form.Item
                            label="Field Name"
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the Field Name",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        <div className="FieldTextDiv">
                          <Form.Item
                            label="Text Alignment"
                            name="alignment"
                            rules={[
                              {
                                required: true,
                                message: "Please select the Text Alignment",
                              },
                            ]}
                          >
                            <Select placeholder="Select Text Algnment">
                              <Select.Option value="center">
                                Center
                              </Select.Option>
                              <Select.Option value="left">Left</Select.Option>
                              <Select.Option value="right">Right</Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </Form.Item>
                    <Form.Item
                      style={{ marginTop: -10 }}
                      label="Field Text"
                      name="text"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the demo text",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <div className="TwoFormItemsDiv">
                      <Form.Item
                        label="Font Size"
                        name="fontSize"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Font Size",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Font Color"
                        name="fontColor"
                        rules={[
                          {
                            required: true,
                            message: "Please select Font Color",
                          },
                        ]}
                      >
                        <Input style={{ width: 100 }} />
                      </Form.Item>
                      <Form.Item
                        label="Font Weight"
                        name="fontWeight"
                        rules={[
                          {
                            required: true,
                            message: "Please select Font Weight",
                          },
                        ]}
                      >
                        <Select placeholder="Select Font Weight">
                          <Select.Option value="300">300</Select.Option>
                          <Select.Option value="400">400</Select.Option>
                          <Select.Option value="500">500</Select.Option>
                          <Select.Option value="600">600</Select.Option>
                          <Select.Option value="700">700</Select.Option>
                          <Select.Option value="800">800</Select.Option>
                          <Select.Option value="900">900</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Font Family"
                        name="fontFamily"
                        rules={[
                          {
                            required: true,
                            message: "Please select Font Family",
                          },
                        ]}
                      >
                        <Select placeholder="Select Font Family">
                          <Select.Option value="Arial">Arial</Select.Option>
                          <Select.Option value="Verdana">Verdana</Select.Option>
                          <Select.Option value="Times New Roman">
                            Times New Roman
                          </Select.Option>
                          <Select.Option value="Courier New">
                            Courier New
                          </Select.Option>
                          <Select.Option value="Georgia">Georgia</Select.Option>
                          <Select.Option value="Tahoma">Tahoma</Select.Option>
                          <Select.Option value="Trebuchet MS">
                            Trebuchet MS
                          </Select.Option>
                          <Select.Option value="Comic Sans MS">
                            Comic Sans MS
                          </Select.Option>
                          <Select.Option value="Impact">Impact</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <Form.Item>
                      <Button
                        style={{
                          background: "#1F2937",
                          color: "White",
                          fontWeight: 600,
                        }}
                        // loading={signupFormLoading}
                        block
                        type="primary"
                        htmlType="submit"
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                ) : null}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ marginTop: -10 }}>
                Please Select to drag or edit any field
              </h3>
              <h3 style={{ marginTop: -20 }}>
                ( To select , click on the field )
              </h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SampleCertificate;
