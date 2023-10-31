import json
from google.cloud import storage

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

def python_file(request):
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
        file_url = request_data["fileUrl"]
        question = request_data["question"]

        results = []

        storage_client = storage.Client()

        # Extract the bucket and file name from the file URL
        url_parts = file_url.split("//storage.googleapis.com/")[1].split("/")
        bucket_name = url_parts[0]
        file_name = "/".join(url_parts[1:])

        # Download the code file from Google Cloud Storage
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        file_contents = blob.download_as_text()

        for input_data in question["inputsOutputs"]:
            sandbox_locals = {}

            code_string = (
                "def execute_user_code():\n"
                f"  {file_contents}\n"
                f"  globals()['res'] = solution({json.dumps(input_data['inputs'])})\n"
                "execute_user_code()"
            )

            exec(code_string, sandbox_locals)

            result = sandbox_locals["res"]
            results.append(result)

        assessment_result = {
            "inputs": [input_data["inputs"] for input_data in question["inputsOutputs"]],
            "outputs": results,
            "expectedOutputs": [input_data["output"] for input_data in question["inputsOutputs"]],
            "isCorrect": [deep_equal(result, input_data["output"]) for result, input_data in zip(results, question["inputsOutputs"])]
        }

        headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
        return (json.dumps(assessment_result), 200, headers)

    except Exception as e:
        import traceback
        traceback.print_exc()
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
        return (json.dumps({"error": str(e)}), 200, headers)
