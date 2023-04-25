import Heading from "@components/login/Heading";
import SubHeading from "@components/login/SubHeading";
import Form from "@components/login/Form";
import UnderForm from "@components/login/UnderForm";
import Bottom from "@components/login/Bottom";

export default function Login() {
    return(
        <div className="d-flex flex-column login">
            <Heading />
            <SubHeading />
            <Form />
            <UnderForm />
            <Bottom />
        </div>
    )
}