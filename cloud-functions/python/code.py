import json

def deep_equal(a, b):
    if a == b:
        return True
    if type(a) != type(b):
        return False
    if isinstance(a, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        for key in a.keys():
            if not deep_equal(a[key], b[key]):
                return False
        return True
    if isinstance(a, list):
        if len(a) != len(b):
            return False
        for i in range(len(a)):
            if not deep_equal(a[i], b[i]):
                return False
        return True
    return False

def python_code(request):
    # Handling CORS headers for preflight requests
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE",
            "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers"),
        }
        return ("", 204, headers)

    try:
        request_data = request.get_json()
        code = request_data["code"]
        question = request_data["question"]

        results = []

        for input_data in question["inputsOutputs"]:
            sandbox_locals = {}
            sandbox_locals["printed_output"] = []
            
            code_string = (
                "def execute_user_code():\n"
                f"  {code}\n"
                f"  globals()['res'] = solution({json.dumps(input_data['inputs'])})\n"
                "execute_user_code()"
            )

            def custom_print(*args):
                formatted_args = []
                for arg in args:
                    if isinstance(arg, str):
                        formatted_args.append(arg)
                    else:
                        formatted_args.append(json.dumps(arg))
                output = " ".join(formatted_args)
                sandbox_locals["printed_output"].append(output)
            
            sandbox_locals['print'] = custom_print

            exec(code_string, sandbox_locals)

            result = sandbox_locals["res"]
            printed_output = sandbox_locals["printed_output"]
            results.append({"result": result, "log": printed_output})

        assessment_result = {
            "inputs": [input_data["inputs"] for input_data in question["inputsOutputs"]],
            "outputs": [result["result"] for result in results],
            "expectedOutputs": [input_data["output"] for input_data in question["inputsOutputs"]],
            "isCorrect": [deep_equal(result["result"], input_data["output"]) for result, input_data in zip(results, question["inputsOutputs"])],
            "logs": [result["log"] for result in results]
        }

        headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"}
        return (json.dumps(assessment_result), 200, headers)

    except Exception as e:
        import traceback
        traceback.print_exc()
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"}
        return (json.dumps({"error": str(e)}), 200, headers)
